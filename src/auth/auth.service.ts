import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from '../users/users.dto';
import * as bcrypt from 'bcrypt';
import { Login } from '../generated/model/login';
import * as speakeasy from 'speakeasy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  private async uniqueUsernameGenerator(username: string) {
    const forwardMatchedUsernames = (
      await this.usersService.findUsersByUsernameLike(`${username}%`)
    ).map((u) => u.username);

    let res = username;
    while (forwardMatchedUsernames.includes(res)) {
      res += Math.floor(Math.random() * 10000);
    }
    return res;
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

  async generateTwoFaSecret(userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      return null;
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    user.two_fa_secret = secret.base32;
    await this.userRepository.save(user);
    return secret;
  }
}
