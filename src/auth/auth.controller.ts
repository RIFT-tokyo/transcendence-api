import { Controller, Get, Post, Redirect, UseGuards } from '@nestjs/common';
import { LoginGuard } from '../common/guards/login.guard';
import { FtOauthGuard } from '../common/guards/ft-oauth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LoginGuard)
  @Post('login')
  @Redirect(process.env.LOGIN_SUCCESS_URL, 307)
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
  @Redirect(process.env.LOGIN_SUCCESS_URL, 307)
  async ftCallback() {
    // redirect client home
  }
}
