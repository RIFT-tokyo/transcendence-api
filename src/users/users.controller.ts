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
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { User as ResponseUser } from '../generated/model/models';
import { User } from '../entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private responseUser(user: User): ResponseUser {
    return {
      ...user,
      followers: user.followers?.length,
      following: user.following?.length,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<ResponseUser> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.responseUser(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/by/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUser> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.responseUser(user);
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
  ): Promise<ResponseUser> {
    const user = await this.usersService.updateUser(id, userData);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.responseUser(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(): Promise<ResponseUser[]> {
    const users = await this.usersService.findAll();
    return users.map(this.responseUser);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/followers')
  async getFollowers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUser[]> {
    const users = await this.usersService.getFollowers(id);
    if (!users) {
      throw new NotFoundException('User not found');
    }
    return users.map(this.responseUser);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/following')
  async getFollowing(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUser[]> {
    const users = await this.usersService.getFollowing(id);
    if (!users) {
      throw new NotFoundException('User not found');
    }
    return users.map(this.responseUser);
  }

  @UseGuards(AuthenticatedGuard)
  @Put('following/:id')
  @HttpCode(204)
  async followUser(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: any,
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
    @Session() session: any,
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
}
