import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ResponseUser } from 'src/generated/model/models';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<ResponseUser> {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userData: UpdateUserDTO,
  ): Promise<ResponseUser> {
    return this.usersService.updateUser(id, userData);
  }

  @Get()
  index(): Promise<ResponseUser[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() userData: CreateUserDTO): Promise<ResponseUser> {
    return this.usersService.createUser(userData);
  }
}
