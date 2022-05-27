import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { Login } from '../generated/model/login';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private async isUsernameAvailable(username: string) {
    const user = await this.usersService.findUserByUsername(username);
    return !user;
  }

  private async uniqueUsernameGenerator(username: string) {
    let uniqueUsername = username;
    while ((await this.isUsernameAvailable(uniqueUsername)) === false) {
      uniqueUsername = uniqueUsername + Math.floor(Math.random() * 10);
    }
    return uniqueUsername;
  }

  async signup(login: Login) {
    const user = await this.usersService.findUserByUsername(login.username);
    if (user) {
      return null;
    }
    const userData: CreateUserDTO = {
      username: login.username,
      password: login.password,
    };
    return await this.usersService.createUser(userData);
  }

  async login(login: Login) {
    const user = await this.usersService.findUserByUsername(login.username);
    if (!user) {
      return null;
    }
    if (await bcrypt.compare(login.password, user.password)) {
      return user;
    }
    return null;
  }

  async validateFtUser(userData: CreateUserDTO) {
    const user = await this.usersService.findUserByIntraId(userData.intra_id);
    if (user) {
      return user;
    }
    userData.username = await this.uniqueUsernameGenerator(userData.username);
    userData.password = null;
    return await this.usersService.createUser(userData);
  }

  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      return null;
    }
    if (await bcrypt.compare(oldPassword, user.password)) {
      return await this.usersService.updateUser(user.id, {
        password: newPassword,
      });
    }
    return null;
  }
}
