import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { LoginGuard } from '../common/guards/login.guard';
import { FtOauthGuard } from '../common/guards/ft-oauth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LoginGuard)
  @Post('login')
  @HttpCode(204)
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
  @HttpCode(204)
  async ftCallback() {
    // redirect client home
  }
}
