import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
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
import { UserSession } from '../types/UserSession';
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
    session.isTwoFaEnabled = false;
    session.isTwoFaAuthenticated = false;
  }

  @Post('login')
  @HttpCode(204)
  async login(@Body() body: Login, @Session() session: UserSession) {
    const user = await this.authService.login(body);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    session.userId = user.id;
    session.isTwoFaEnabled = user.is_two_fa_enabled;
    session.isTwoFaAuthenticated = false;
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
    const user = await this.authService.findUserById(request.user.id);
    session.userId = request.user.id;
    session.isTwoFaEnabled = user.is_two_fa_enabled;
    session.isTwoFaAuthenticated = false;
    if (user.is_two_fa_enabled) {
      return { url: process.env.FRONT_TWO_FA_URL };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  @HttpCode(204)
  logout(@Req() request: { session: UserSession }) {
    request.session = null;
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

  @Post('2fa/authenticate')
  @HttpCode(204)
  async twoFaAuthenticate(
    @Body() body: { authcode: string },
    @Session() session: UserSession,
  ) {
    const { authcode } = body;
    const verified = await this.authService.verifyTwoFaAuthcode(
      session.userId,
      authcode,
    );
    if (!verified) {
      throw new BadRequestException('Invalid authcode');
    }
    session.isTwoFaAuthenticated = true;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('2fa/activate')
  @HttpCode(204)
  async twoFaActivate(
    @Body() body: { authcode: string },
    @Session() session: UserSession,
  ) {
    const { authcode } = body;
    const verified = await this.authService.verifyTwoFaAuthcode(
      session.userId,
      authcode,
    );
    if (!verified) {
      throw new BadRequestException('Invalid authcode');
    }
    const user = await this.authService.turnOnTwoFa(session.userId);
    if (!user) {
      throw new BadRequestException('Invalid authcode');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('2fa/deactivate')
  @HttpCode(200)
  async twoFaDeactivate(@Session() session: UserSession) {
    const user = await this.authService.turnOffTwoFa(session.userId);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('2fa/qrcode')
  @HttpCode(200)
  async getTwoFaQRcode(@Session() session: UserSession) {
    const qrcode = await this.authService.generateTwoFaSecretAndQr(
      session.userId,
    );
    if (!qrcode) {
      throw new NotFoundException('User not found');
    }
    return { qrcode };
  }
}
