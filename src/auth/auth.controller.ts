import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Redirect,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from '../generated/model/login';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { UserSession } from 'src/types/userSession';
import { User } from 'src/entities/user.entity';
import { Password } from '../generated/model/password';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(204)
  async createUser(@Body() body: Login, @Session() session: UserSession) {
    const user = await this.authService.signup(body);
    if (!user) {
      throw new ConflictException('User already exists');
    }
    session.userId = user.id;
  }

  @Post('login')
  @HttpCode(204)
  async login(@Body() body: Login, @Session() session: UserSession) {
    const user = await this.authService.login(body);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    session.userId = user.id;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  @HttpCode(204)
  logout(@Req() request: { session: UserSession }) {
    request.session = null;
  }

  @UseGuards(AuthGuard('42'))
  @Get('login')
  loginWith42() {
    // Guard redirects
  }

  @UseGuards(AuthGuard('42'))
  @Get('callback')
  @Redirect(process.env.FRONT_INDEX_URL)
  async callbackWith42(
    @Req() request: { user: User },
    @Session() session: UserSession,
  ) {
    session.userId = request.user.id;
  }

  @UseGuards(AuthenticatedGuard)
  @Put('password')
  @HttpCode(204)
  async updatePassword(
    @Body() body: Password,
    @Session() session: UserSession,
  ) {
    const user = await this.authService.updatePassword(
      session.userId,
      body.old_password,
      body.new_password,
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
