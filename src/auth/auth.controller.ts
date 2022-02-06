import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginGuard } from '../common/guards/login.guard';
import { FtOauthGuard } from '../common/guards/ft-oauth-guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LoginGuard)
  @Post('login')
  login() {
    return {
      url: 'http://localhost:4212/',
      statusCode: 307,
    };
  }

  @UseGuards(FtOauthGuard)
  @Get('login')
  ftOauthLogin() {
    // Guard redirects
  }

  @UseGuards(FtOauthGuard)
  @Get('callback')
  async ftCallback() {
    console.log('ft oauth!!');
    return {
      url: 'http://localhost:4212/',
      statusCode: 307,
    };
  }
}
