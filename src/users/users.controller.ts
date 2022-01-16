import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDTO) {
    return this.usersService.updateUser(id, userData);
  }

  @Get()
  index() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() userData: CreateUserDTO) {
    return this.usersService.createUser(userData);
  }
}
