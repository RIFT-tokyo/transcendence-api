import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../users/users.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username, password): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    if (user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateFtUser(userData: CreateUserDTO) {
    const { username } = userData;
    const user: User | null = await this.usersService.findUserByUsername(
      username,
    );
    if (user) {
      return user;
    }
    return await this.usersService.createUser(userData);
  }
}
