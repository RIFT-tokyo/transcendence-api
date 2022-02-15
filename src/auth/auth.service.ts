import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../users/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username, password): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    if (await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateFtUser(userData: CreateUserDTO) {
    let user: User;
    try {
      user = await this.usersService.findUserByUsername(userData.username);
    } catch (e) {}
    if (user) {
      return user;
    }
    return await this.usersService.createUser(userData);
  }
}
