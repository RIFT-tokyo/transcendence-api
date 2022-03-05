import {
  Controller,
  Get,
  InternalServerErrorException,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { User as ResponseUser } from '../generated/model/models';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from '../common/interceptor/current-user.interceptor';

@Controller('me')
@UseInterceptors(CurrentUserInterceptor)
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getMe(@Session() session: any): Promise<ResponseUser> {
    const user = await this.usersService.findUserById(session.userId);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }
}
