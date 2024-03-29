import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Session,
  Post,
  InternalServerErrorException,
  Logger,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UpdateUserDTO,
  ResponseUserDTO,
  ResponseUserListDTO,
} from './users.dto';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { S3 } from 'aws-sdk';
import { UserSession } from '../types/UserSession';
import { v4 as uuidv4 } from 'uuid';
import { PaginationParams } from '../types/PaginationParams';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) {}

  private validateAlNum(str: string): boolean {
    return !!str.match(/^[0-9a-zA-Z]+$/);
  }

  private async deleteS3Object(key: string) {
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_DOCKER_ENDPOINT_URL,
      s3ForcePathStyle: true,
    });
    await s3
      .deleteObject(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        },
        function (err) {
          if (err) {
            throw new InternalServerErrorException(
              'file delete failed: ' + err,
            );
          }
        },
      )
      .promise();
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUserDTO> {
    const user = await this.usersService.findUserById(id, [
      'following',
      'followers',
      'achievements',
    ]);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new ResponseUserDTO(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/by/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUserDTO> {
    const user = await this.usersService.findUserByUsername(username, [
      'following',
      'followers',
      'achievements',
    ]);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new ResponseUserDTO(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const ret = await this.usersService.deleteUser(id);
    if (ret.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDTO,
  ): Promise<ResponseUserDTO> {
    if (!this.validateAlNum(userData.username)) {
      throw new BadRequestException(
        'username must contain only alphanumeric characters',
      );
    }
    const sameUsernameUser = await this.usersService.findUserByUsername(
      userData.username,
    );
    if (sameUsernameUser && sameUsernameUser.id !== id) {
      throw new BadRequestException(`${userData.username} is already taken`);
    }

    const user = await this.usersService.updateUser(id, userData);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new ResponseUserDTO(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(
    @Query() { limit = 10, offset }: PaginationParams,
  ): Promise<ResponseUserListDTO> {
    const entriesList = await this.usersService.findAll(limit, offset);
    return new ResponseUserListDTO(entriesList);
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: UserSession,
  ) {
    if (session.userId !== id || !file) {
      throw new BadRequestException();
    }
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('user profile not found');
    }
    const mimeTypeSplitted = file.mimetype.split('/');
    const ext = mimeTypeSplitted[mimeTypeSplitted.length - 1];
    const key = id.toString() + '-profile-' + uuidv4() + '.' + ext;
    if (user.profile_image) {
      const profileImageSplitted = user.profile_image.split('/');
      const old_key = profileImageSplitted[profileImageSplitted.length - 1];
      this.deleteS3Object(old_key);
    }

    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_DOCKER_ENDPOINT_URL,
      s3ForcePathStyle: true,
    });
    await s3
      .upload(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Body: file.buffer,
          Key: key,
        },
        function (err) {
          if (err) {
            throw new InternalServerErrorException(
              'file upload failed: ' + err,
            );
          }
        },
      )
      .promise();

    const new_path =
      process.env.AWS_S3_HOST_ENDPOINT_URL +
      '/' +
      process.env.AWS_S3_BUCKET_NAME +
      '/' +
      key;
    await this.usersService.updateUser(id, { profile_image: new_path });
    return { file_path: new_path };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id/images')
  @HttpCode(204)
  async deleteProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ) {
    if (session.userId !== id) {
      throw new BadRequestException('Not Authorized');
    }
    const user = await this.usersService.findUserById(id);
    if (!user || !user.profile_image) {
      throw new NotFoundException('user profile not found');
    }
    const profileImageSplited = user.profile_image.split('/');
    const key = profileImageSplited[profileImageSplited.length - 1];

    this.deleteS3Object(key);

    await this.usersService.updateUser(id, {
      profile_image: null,
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/followers')
  async getFollowers(
    @Param('id', ParseIntPipe) id: number,
    @Query() { limit = 10, offset }: PaginationParams,
  ): Promise<ResponseUserListDTO> {
    const entriesList = await this.usersService.getFollowers(id, limit, offset);
    if (!entriesList) {
      throw new NotFoundException('User not found');
    }
    return new ResponseUserListDTO(entriesList);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/following')
  async getFollowing(
    @Param('id', ParseIntPipe) id: number,
    @Query() { limit = 10, offset }: PaginationParams,
  ): Promise<ResponseUserListDTO> {
    const entriesList = await this.usersService.getFollowing(id, limit, offset);
    if (!entriesList) {
      throw new NotFoundException('User not found');
    }
    return new ResponseUserListDTO(entriesList);
  }

  @UseGuards(AuthenticatedGuard)
  @Put('following/:id')
  @HttpCode(204)
  async followUser(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<void> {
    if (session.userId === id) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const ret = await this.usersService.follow(session.userId, id);
    if (!ret) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('following/:id')
  @HttpCode(204)
  async unfollowUser(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<void> {
    if (session.userId === id) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const ret = await this.usersService.unFollow(session.userId, id);
    if (!ret) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/following/:targetId')
  @HttpCode(204)
  async isFollowing(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ): Promise<void> {
    if (id === targetId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const ret = await this.usersService.isFollowing(id, targetId);
    if (!ret) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/block')
  async getBlockUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUserDTO[]> {
    const blockList = await this.usersService.getBlockUsers(id);
    if (!blockList) {
      throw new NotFoundException('User not found');
    }
    return blockList.map((user) => new ResponseUserDTO(user));
  }

  @UseGuards(AuthenticatedGuard)
  @Put('block/:id')
  @HttpCode(204)
  async blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<void> {
    if (session.userId === id) {
      throw new BadRequestException('You cannot block yourself');
    }
    const ret = await this.usersService.block(session.userId, id);
    if (!ret) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('block/:id')
  @HttpCode(204)
  async unblockUser(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: UserSession,
  ): Promise<void> {
    if (session.userId === id) {
      throw new BadRequestException('You cannot block yourself');
    }
    const ret = await this.usersService.unBlock(session.userId, id);
    if (!ret) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/block/:targetId')
  @HttpCode(204)
  async isBlocking(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ): Promise<void> {
    if (id === targetId) {
      throw new BadRequestException('You cannot block yourself');
    }
    const ret = await this.usersService.isBlocking(id, targetId);
    if (!ret) {
      throw new NotFoundException('User not found');
    }
  }
}
