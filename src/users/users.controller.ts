import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ResponseUser } from '../generated/model/models';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<ResponseUser> {
    const user = await this.usersService.findUserById(id);
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/by/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUser> {
    const user = await this.usersService.findUserByUsername(username);
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDTO,
  ): Promise<ResponseUser> {
    const user = await this.usersService.updateUser(id, userData);
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(): Promise<ResponseUser[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => ({
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    }));
  }

  @Post()
  async create(@Body() userData: CreateUserDTO): Promise<ResponseUser> {
    if (userData.password === undefined) {
      throw new BadRequestException('password required');
    }
    const user = await this.usersService.createUser(userData);
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  @Post(':id/images')
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_S3_ENDPOINT_URL,
      s3ForcePathStyle: true,
    });
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Body: file.buffer,
        Key: `${uuid()}-${file.originalname}`,
      })
      .promise();
    await this.usersService.updateUser(id, {
      profile_image: uploadResult.Location,
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/followers')
  async getFollowers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUser[]> {
    const users = await this.usersService.getFollowers(id);
    return users.map((user) => ({
      ...user,
      followers: user.followers?.length,
      following: user.following?.length,
    }));
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/following')
  async getFollowing(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUser[]> {
    const users = await this.usersService.getFollowing(id);
    return users.map((user) => ({
      ...user,
      followers: user.followers?.length,
      following: user.following?.length,
    }));
  }

  @UseGuards(AuthenticatedGuard)
  @Put('following/:id')
  @HttpCode(204)
  async followUser(
    @Req() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.usersService.follow(request.user, id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('following/:id')
  @HttpCode(204)
  async unfollowUser(
    @Req() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.usersService.unFollow(request.user, id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/following/:targetId')
  @HttpCode(204)
  async isFollowing(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ): Promise<void> {
    await this.usersService.isFollowing(id, targetId);
  }
}
