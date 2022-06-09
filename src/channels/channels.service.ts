import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { NewChannel } from 'src/generated';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  async findAll() {
    return await this.channelsRepository.find({ relations: ['users'] });
  }

  async findById(id: number) {
    return await this.channelsRepository.findOne(id);
  }

  async create(channel: NewChannel) {
    if (channel.password) {
      channel.password = await bcrypt.hash(
        channel.password,
        Number(process.env.HASH_SALT),
      );
    }
    return await this.channelsRepository.save(channel);
  }
}
