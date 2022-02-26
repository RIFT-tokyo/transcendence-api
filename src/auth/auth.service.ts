import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { Login } from '../generated/model/login';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private async createHashedPassword(password: string) {
    if (password === undefined) {
      return null;
    }
    return await bcrypt.hash(password, Number(process.env.HASH_SALT));
  }

  async signup(login: Login) {
    const userData: CreateUserDTO = {
      username: login.username,
      password: await this.createHashedPassword(login.password),
    };
    return await this.usersService.createUser(userData);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      return null;
    }
    if (await bcrypt.compare(password, user.password)) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  async validateFtUser(userData: CreateUserDTO) {
    const user = await this.usersService.findUserByUsername(userData.username);
    if (user) {
      return user;
    }
    userData.password = null;
    return await this.usersService.createUser(userData);
  }
}
