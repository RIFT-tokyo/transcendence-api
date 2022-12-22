import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ChannelUser, NewChannel, UpdateChannelUser } from '../generated';
import { UserSession } from '../types/UserSession';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ChannelUserDTO, ResponseChannelDTO } from './channels.dto';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

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
    const channelUserPermission = await this.channelsService.create(
      channelData,
      session.userId,
    );
    return new ResponseChannelDTO(channelUserPermission);
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async updateChannel(
    @Session() session: UserSession,
    @Body() channelData: NewChannel,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const channel = await this.channelsService.update(
      id,
      channelData,
      session.userId,
    );
    if (!channel) {
      throw new BadRequestException('Permission denied');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/users')
  async getChannelUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChannelUserDTO[]> {
    const channelUserPermissions =
      await this.channelsService.findChannelsByChannelId(id);
    return channelUserPermissions.map(
      (channelUser) => new ChannelUserDTO(channelUser),
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id/users')
  async updateChannelUserPermissions(
    @Session() session: UserSession,
    @Param('id', ParseIntPipe) id: number,
    @Body() channelUserList: ChannelUser[],
  ): Promise<ChannelUserDTO[]> {
    const mePermission =
      await this.channelsService.findChannelByChannelIdAndUserId(
        id,
        session.userId,
      );
    if (!mePermission || mePermission.role !== 'owner') {
      throw new UnauthorizedException();
    }
    await Promise.all(
      channelUserList.map(
        async (channelUser) =>
          await this.channelsService.updateUserPermissions(id, channelUser),
      ),
    );

    const channelUserPermissions =
      await this.channelsService.findChannelsByChannelId(id);
    return channelUserPermissions.map(
      (channelUser) => new ChannelUserDTO(channelUser),
    );
  }
}
