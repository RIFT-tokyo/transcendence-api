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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
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
    return this.responseUser(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/by/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUser> {
    const user = await this.usersService.findUserByUsername(username);
    return this.responseUser(user);
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
    return this.responseUser(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(): Promise<ResponseUser[]> {
    const users = await this.usersService.findAll();
    return users.map(this.responseUser);
  }

  @Post()
  async create(@Body() userData: CreateUserDTO): Promise<ResponseUser> {
    if (userData.password === undefined) {
      throw new BadRequestException('password required');
    }
    const user = await this.usersService.createUser(userData);
    return this.responseUser(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/followers')
  async getFollowers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUser[]> {
    const users = await this.usersService.getFollowers(id);
    return users.map(this.responseUser);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/following')
  async getFollowing(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUser[]> {
    const users = await this.usersService.getFollowing(id);
    return users.map(this.responseUser);
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
