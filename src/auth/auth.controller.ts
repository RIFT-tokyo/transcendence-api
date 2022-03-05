import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from '../generated/model/login';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(204)
  async createUser(@Body() body: Login, @Session() session: any) {
    const user = await this.authService.signup(body);
    if (!user) {
      throw new BadRequestException('User already exists');
    }
    session.userId = user.id;
  }

  @Post('login')
  @HttpCode(204)
  async login(@Body() body: Login, @Session() session: any) {
    const user = await this.authService.login(body);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    session.userId = user.id;
  }

  // @Post('logout')
  // logout(@Session() session: any) {
  //   session.userId = null;
  // }

  @UseGuards(AuthGuard('42'))
  @Get('login')
  loginWith42() {
    // Guard redirects
  }

  @UseGuards(AuthGuard('42'))
  @Get('callback')
  async callbackWith42(@Session() session: any) {
    return session;
    // throw new BadRequestException('Method not implemented.');
  }
}
