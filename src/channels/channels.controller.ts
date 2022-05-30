import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NewChannel } from 'src/generated';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ResponseChannelDTO } from './channels.dto';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

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

  }
}
