import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id') id: number) {
    this.usersService.deleteUser(id);
    return;
  }

  @Put(':id')
  @HttpCode(200)
  async updateUser(@Param('id') id: number, @Body() userData: Partial<User>) {
    this.usersService.updateUser(id, userData);
    return;
  }

  @Get()
  index() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() userData: User) {
    return this.usersService.createUser(userData);
  }
}
