import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from '../common/interceptor/current-user.interceptor';
import { UserSession } from '../types/UserSession';
import { ResponseUserDTO } from './users.dto';
import { ResponseChannelDTO } from '../channels/channels.dto';
import { ChannelUserPermissionsService } from '../channels/channel-user-permissions.service';
import {
  CreateChannelUserPermissionDTO,
  ResponseChannelUserPermissionDTO,
} from '../channels/channel-user-permissions.dto';
import { ChannelPassword } from '../generated';

@Controller('me')
@UseInterceptors(CurrentUserInterceptor)
export class MeController {
  private readonly logger = new Logger('MeController');
  constructor(
    private readonly usersService: UsersService,
    private readonly channelUserPermissionsService: ChannelUserPermissionsService,
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
      await this.channelUserPermissionsService.findByUserId(session.userId);
    return channelUserPermissions.map((v) => new ResponseChannelDTO(v));
  }

  @UseGuards(AuthenticatedGuard)
  @Put('channels/:channelId')
  async joinChannel(
    @Session() session: UserSession,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() channelPassword: ChannelPassword,
  ): Promise<ResponseChannelUserPermissionDTO> {
    const channelUserPermissionData: CreateChannelUserPermissionDTO = {
      channelId,
      userId: session.userId,
      password: channelPassword.password,
    };
    const channelUserPermission = await this.channelUserPermissionsService.join(
      channelUserPermissionData,
    );
    return new ResponseChannelUserPermissionDTO(channelUserPermission);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('channels/:channelId')
  @HttpCode(204)
  async leaveChannel(
    @Session() session: UserSession,
    @Param('channelId', ParseIntPipe) channelId: number,
  ): Promise<void> {
    const ret = await this.channelUserPermissionsService.leave(
      channelId,
      session.userId,
    );
    if (ret.affected === 0) {
      throw new NotFoundException('ChannelUser not found');
    }
  }
}
