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
}
