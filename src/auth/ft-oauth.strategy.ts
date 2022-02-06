import { Strategy, Profile } from 'passport-42';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/users.dto';

@Injectable()
export class FtOauthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_APP_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.OAUTH_REDIRECT_URL,
      scope: 'public',
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const userData: CreateUserDTO = {
      username: profile.login,
      display_name: profile.displayname,
      profile_image: profile.image_url,
      status_message: "I'm feeling lucky.",
    };

    const user = await this.authService.validateFtUser(userData);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
