import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { User as ResponseUser } from '../generated/model/models';
import { UsersService } from './users.service';

@Controller('me')
@UseInterceptors(ClassSerializerInterceptor)
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getMe(@Req() request): Promise<ResponseUser> {
    const user = await this.usersService.findUserById(request.user);
    return {
      ...user,
      followers: user.followers.length,
      following: user.following.length,
    };
  }
}
