import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ResponseUser } from '../generated/model/models';
import { FollowsService } from '../follows/follows.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly followsService: FollowsService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<ResponseUser> {
    const user = await this.usersService.findUserById(id);
    const followewrIds = await this.followsService.findFollowers(id);
    const followingIds = await this.followsService.findFollowing(id);
    return {
      ...user,
      following: followingIds.length,
      followers: followewrIds.length,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/by/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUser> {
    const user = await this.usersService.findUserByUsername(username);
    const followewrIds = await this.followsService.findFollowers(user.id);
    const followingIds = await this.followsService.findFollowing(user.id);
    return {
      ...user,
      following: followingIds.length,
      followers: followewrIds.length,
    };
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
    const followerIds = await this.followsService.findFollowers(user.id);
    const followingIds = await this.followsService.findFollowing(user.id);
    return {
      ...user,
      following: followingIds.length,
      followers: followerIds.length,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(): Promise<ResponseUser[]> {
    const users = await this.usersService.findAll();
    return await Promise.all(
      users.map(async (user) => {
        const followerIds = await this.followsService.findFollowers(user.id);
        const followingIds = await this.followsService.findFollowing(user.id);
        return {
          ...user,
          following: followingIds.length,
          followers: followerIds.length,
        };
      }),
    );
  }

  @Post()
  async create(@Body() userData: CreateUserDTO): Promise<ResponseUser> {
    if (userData.password === undefined) {
      throw new BadRequestException('password required');
    }
    const user = await this.usersService.createUser(userData);
    const followewrIds = await this.followsService.findFollowers(user.id);
    const followingIds = await this.followsService.findFollowing(user.id);
    return {
      ...user,
      following: followingIds.length,
      followers: followewrIds.length,
    };
  }

  @Get(':id/follows')
  async getFollowings(@Param('id') id: number): Promise<ResponseUser[]> {
    const followingIds = await this.followsService.findFollowing(id);
    const users = await this.usersService.findUsersByIds(followingIds);
    return await Promise.all(
      users.map(async (user) => {
        const followerIds = await this.followsService.findFollowers(user.id);
        const followingIds = await this.followsService.findFollowing(user.id);
        return {
          ...user,
          following: followingIds.length,
          followers: followerIds.length,
        };
      }),
    );
  }

  @Get(':id/following')
  async getFollowing(@Param('id') id: number): Promise<ResponseUser[]> {
    const follwerIds = await this.followsService.findFollowers(id);
    const users = await this.usersService.findUsersByIds(follwerIds);
    return await Promise.all(
      users.map(async (user) => {
        const followerIds = await this.followsService.findFollowers(user.id);
        const followingIds = await this.followsService.findFollowing(user.id);
        return {
          ...user,
          following: followingIds.length,
          followers: followerIds.length,
        };
      }),
    );
  }

  @Put('following/:id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async follow(@Param('id') id: number): Promise<void> {
    return;
  }

  @Delete('following/:id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async unfollow(@Param('id') id: number): Promise<void> {
    return;
  }

  @Get(':id/following/:targetId')
  async isFollowing(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id') userId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('targetId') targetUserId: number,
  ): Promise<void> {
    return;
  }
}
