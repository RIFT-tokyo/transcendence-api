import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
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
