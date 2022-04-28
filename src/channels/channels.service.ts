import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { NewChannel } from 'src/generated';
import { ResponseChannelDTO } from './channels.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  async findAll() {
    return await this.channelsRepository.find();
  }

  async create(channel: NewChannel) {
    if (channel.password) {
      channel.password = await bcrypt.hash(
        channel.password,
        Number(process.env.HASH_SALT),
      );
    }
    const result = await this.channelsRepository.save(channel);
    return new ResponseChannelDTO(result);
  }
}
