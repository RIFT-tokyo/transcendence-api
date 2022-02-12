import { Controller, Get, Post, Redirect, UseGuards } from '@nestjs/common';
import { LoginGuard } from '../common/guards/login.guard';
import { FtOauthGuard } from '../common/guards/ft-oauth-guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LoginGuard)
  @Post('login')
  @Redirect('http://localhost:4212', 307)
  login() {
    // redirect client home
  }

  @UseGuards(FtOauthGuard)
  @Get('login')
  ftOauthLogin() {
    // Guard redirects
  }

  @UseGuards(FtOauthGuard)
  @Get('callback')
  @Redirect('http://localhost:4212', 307)
  async ftCallback() {
    // redirect client home
  }
}
