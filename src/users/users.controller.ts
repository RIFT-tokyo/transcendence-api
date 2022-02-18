import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ResponseUser } from '../generated/model/models';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<ResponseUser> {
    const user = await this.usersService.findUserById(id);
    return Object.assign(user, { followers: 42, following: 42 });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/by/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUser> {
    const user = await this.usersService.findUserByUsername(username);
    return Object.assign(user, { followers: 42, following: 42 });
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userData: UpdateUserDTO,
  ): Promise<ResponseUser> {
    const user = await this.usersService.updateUser(id, userData);
    return Object.assign(user, { followers: 42, following: 42 });
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(): Promise<ResponseUser[]> {
    const users = await this.usersService.findAll();
    const res = users.map((user) => {
      return Object.assign(user, { followers: 42, following: 42 });
    });
    return res;
  }

  @Post()
  async create(@Body() userData: CreateUserDTO): Promise<ResponseUser> {
    if (userData.password === undefined) {
      throw new BadRequestException('password required');
    }
    const user = await this.usersService.createUser(userData);
    return Object.assign(user, { followers: 42, following: 42 });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/users/:id/followers')
  async getFollowers(@Param('id') id: number): Promise<ResponseUser[]> {
    return [];
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/users/:id/following')
  async getFollowing(@Param('id') id: number): Promise<ResponseUser[]> {
    return [];
  }

  @UseGuards(AuthenticatedGuard)
  @Put('/users/following/:id')
  @HttpCode(204)
  async followUser(@Req() request, @Param('id') id: number): Promise<void> {
    return;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/users/following/:id')
  @HttpCode(204)
  async unfollowUser(@Req() request, @Param('id') id: number): Promise<void> {
    return;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/users/:id/following/:targetId')
  @HttpCode(204)
  async isFollowing(
    @Param('id') id: number,
    @Param('targetId') targetId: number,
  ): Promise<void> {
    return;
  }
}
