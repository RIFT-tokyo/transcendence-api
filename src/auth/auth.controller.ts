import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginGuard } from '../common/guards/login.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LoginGuard)
  @Post('login')
  login() {
    return 'welcome. here is login.';
  }
}
