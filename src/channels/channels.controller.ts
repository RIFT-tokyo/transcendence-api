import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { NewChannel } from 'src/generated';
import { UserSession } from 'src/types/UserSession';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import {
  CreateChannelUserPermissionDTO,
  ResponseChannelUserPermissionDTO,
  UpdateChannelUserPermissionDTO,
} from './channel-user-permissions.dto';
import { ChannelUserPermissionsService } from './channel-user-permissions.service';
import { ResponseChannelDTO } from './channels.dto';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly channelUsersService: ChannelUserPermissionsService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getChannels(): Promise<ResponseChannelDTO[]> {
    const channels = await this.channelsService.findAll();
    return channels.map((channel) => new ResponseChannelDTO(channel));
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  @HttpCode(201)
  async createChannel(
    @Body() channelData: NewChannel,
  ): Promise<ResponseChannelDTO> {
    const channel = await this.channelsService.create(channelData);
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    return new ResponseChannelDTO(channel);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async getMeChannels(
    @Session() session: UserSession,
  ): Promise<ResponseChannelUserPermissionDTO[]> {
    const channelUsers = await this.channelUsersService.findByUserId(
      session.userId,
    );
    return channelUsers.map(
      (channelUser) => new ResponseChannelUserPermissionDTO(channelUser),
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/users')
  async getChannelUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseChannelUserPermissionDTO[]> {
    const channelUsers = await this.channelUsersService.findByChannelId(id);
    return channelUsers.map(
      (channelUser) => new ResponseChannelUserPermissionDTO(channelUser),
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id')
  async createChannelUser(
    @Session() session: UserSession,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseChannelUserPermissionDTO> {
    const channelUserData: CreateChannelUserPermissionDTO = {
      channelId: id,
      userId: session.userId,
      is_ban: false,
      role: null,
    };
    const channelUser = await this.channelUsersService.create(channelUserData);
    return new ResponseChannelUserPermissionDTO(channelUser);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteChannelUser(
    @Session() session: UserSession,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const ret = await this.channelUsersService.delete(id, session.userId);
    if (ret.affected === 0) {
      throw new NotFoundException('ChannelUser not found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id/users/:userId')
  async updateChannelUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() channelUserData: UpdateChannelUserPermissionDTO,
  ) {
    const channelUser = await this.channelUsersService.update(
      id,
      userId,
      channelUserData,
    );
    if (!channelUser) {
      throw new NotFoundException('ChannelUser not found');
    }
    return new ResponseChannelUserPermissionDTO(channelUser);
  }
}
