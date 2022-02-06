import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

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
}
