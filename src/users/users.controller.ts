import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.findUserById(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/by/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsername(username);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDTO) {
    return this.usersService.updateUser(id, userData);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  index() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() userData: CreateUserDTO) {
    return this.usersService.createUser(userData);
  }
}
