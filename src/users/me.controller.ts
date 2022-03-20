import {
  Controller,
  Get,
  InternalServerErrorException,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from '../common/interceptor/current-user.interceptor';
import { UserSession } from 'src/types/user-session';
import { ResponseUserDTO } from './users.dto';

@Controller('me')
@UseInterceptors(CurrentUserInterceptor)
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getMe(@Session() session: UserSession): Promise<ResponseUserDTO> {
    const user = await this.usersService.findUserById(session.userId);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return new ResponseUserDTO(user);
  }
}
