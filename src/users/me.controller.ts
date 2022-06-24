import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Put,
  Session,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from '../common/interceptor/current-user.interceptor';
import { UserSession } from '../types/UserSession';
import { ResponseUserDTO } from './users.dto';
import { ResponseChannelDTO } from '../channels/channels.dto';
import { ChannelPassword } from '../generated';
import { ChannelsService } from '../channels/channels.service';

@Controller('me')
@UseInterceptors(CurrentUserInterceptor)
export class MeController {
  private readonly logger = new Logger('MeController');
  constructor(
    private readonly usersService: UsersService,
    private readonly channelsService: ChannelsService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getMe(@Session() session: UserSession): Promise<ResponseUserDTO> {
    const user = await this.usersService.findUserById(session.userId, [
      'following',
      'followers',
      'achievements',
    ]);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return new ResponseUserDTO(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('channels')
  async getMeChannels(
    @Session() session: UserSession,
  ): Promise<ResponseChannelDTO[]> {
    const channelUserPermissions =
      await this.channelsService.findChannelsByUserId(session.userId);
    return channelUserPermissions.map((v) => new ResponseChannelDTO(v));
  }

  @UseGuards(AuthenticatedGuard)
  @Put('channels/:channelId')
  async joinChannel(
    @Session() session: UserSession,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() channelPassword: ChannelPassword,
  ): Promise<ResponseChannelDTO> {
    const channelUserPermission = await this.channelsService.join(
      channelId,
      session.userId,
      channelPassword.password,
    );
    if (!channelUserPermission) {
      throw new UnauthorizedException();
    }
    return new ResponseChannelDTO(channelUserPermission);
  }

  // TODO: チャンネルleave機能実装時にコメントアウトを解除する
  // @UseGuards(AuthenticatedGuard)
  // @Delete('channels/:channelId')
  // @HttpCode(204)
  // async leaveChannel(
  //   @Session() session: UserSession,
  //   @Param('channelId', ParseIntPipe) channelId: number,
  // ): Promise<void> {
  //   const ret = await this.channelsService.leave(channelId, session.userId);
  //   if (ret.affected === 0) {
  //     throw new NotFoundException('ChannelUser not found');
  //   }
  // }
}
