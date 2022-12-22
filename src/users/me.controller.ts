import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { PmsService } from '../pms/pms.service';

@Controller('me')
@UseInterceptors(CurrentUserInterceptor)
export class MeController {
  private readonly logger = new Logger('MeController');
  constructor(
    private readonly usersService: UsersService,
    private readonly channelsService: ChannelsService,
    private readonly pmsService: PmsService,
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
    const channel = await this.channelsService.findChannelById(channelId);
    if (!channel) {
      throw new NotFoundException();
    }
    const channelUserPermission = await this.channelsService.join(
      channel,
      session.userId,
      channelPassword.password,
    );
    if (!channelUserPermission) {
      throw new UnauthorizedException();
    }
    return new ResponseChannelDTO(channelUserPermission);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('pms')
  async getMePMs(@Session() session: UserSession): Promise<ResponseUserDTO[]> {
    const privateMessageUser = await this.pmsService.findPrivateMessageUserById(
      session.userId,
    );
    return privateMessageUser
      ? privateMessageUser.to_users.map((user) => new ResponseUserDTO(user))
      : [];
  }

  @UseGuards(AuthenticatedGuard)
  @Put('pms/:userId')
  async createPM(
    @Session() session: UserSession,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseUserDTO> {
    const user = await this.pmsService.findOrCreatePrivateMessageUser(
      session.userId,
      userId,
    );
    if (!user) {
      throw new NotFoundException();
    }
    return new ResponseUserDTO(user);
  }
}
