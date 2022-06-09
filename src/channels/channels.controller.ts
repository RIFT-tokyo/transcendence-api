import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { NewChannel } from '../generated';
import { UserSession } from '../types/UserSession';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ChannelUserPermissionsService } from './channel-user-permissions.service';
import { ChannelUserDTO } from './channel-user.dto';
import { ResponseChannelDTO } from './channels.dto';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly channelUserPermissionsService: ChannelUserPermissionsService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getChannels(
    @Session() session: UserSession,
  ): Promise<ResponseChannelDTO[]> {
    const channels = await this.channelsService.findAll();
    return channels.map(
      (channel) => new ResponseChannelDTO(channel, session.userId),
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  @HttpCode(201)
  async createChannel(
    @Session() session: UserSession,
    @Body() channelData: NewChannel,
  ): Promise<ResponseChannelDTO> {
    const channelUserPermission =
      await this.channelUserPermissionsService.create(
        channelData,
        session.userId,
      );
    return new ResponseChannelDTO(channelUserPermission);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/users')
  async getChannelUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChannelUserDTO[]> {
    const channelUserPermissions =
      await this.channelUserPermissionsService.findByChannelId(id);
    return channelUserPermissions.map(
      (channelUser) => new ChannelUserDTO(channelUser),
    );
  }
}
