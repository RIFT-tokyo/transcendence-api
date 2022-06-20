import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { NewChannel } from '../generated';
import { UserSession } from '../types/UserSession';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ChannelUserPermissionsService } from './channel-user-permissions.service';
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
}
