import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { NewChannel } from 'src/generated';
import * as bcrypt from 'bcrypt';
import { ChannelMessage } from 'src/entities/channel-message.entity';
import { Message } from 'src/entities/message.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelMessage)
    private readonly channelMessageRepository: Repository<ChannelMessage>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return await this.channelsRepository.find();
  }

  async findChannelById(id: number, relations: Array<string> = []) {
    return await this.channelsRepository.findOne({ id }, { relations });
  }

  async createMessage(userId: number, channelId: number, text: string) {
    const user = await this.usersService.findUserById(userId);
    const channel = await this.findChannelById(channelId);
    const message = new Message();
    message.text = text;
    const savedMessage = await this.messageRepository.save(message);

    const channelMessage = new ChannelMessage();
    channelMessage.user = user;
    channelMessage.channel = channel;
    channelMessage.message = savedMessage;
    return await this.channelMessageRepository.save(channelMessage);
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
