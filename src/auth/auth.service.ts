import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { Login } from '../generated/model/login';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(login: Login) {
    const user = await this.usersService.findUserByUsername(login.username);
    if (user) {
      return null;
    }

    const password = await bcrypt.hash(
      login.password,
      Number(process.env.HASH_SALT),
    );

    const userData: CreateUserDTO = {
      username: login.username,
      password: password,
    };
    return await this.usersService.createUser(userData);
  }

  async login(login: Login) {
    const user = await this.usersService.findUserByUsername(login.username);
    if (!user) {
      return null;
    }
    if (await bcrypt.compare(login.password, user.password)) {
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
