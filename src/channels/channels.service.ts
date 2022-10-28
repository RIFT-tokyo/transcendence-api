import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { In, Repository } from 'typeorm';
import { ChannelUser, NewChannel, UpdateChannelUser } from '../generated';
import * as bcrypt from 'bcrypt';
import { ChannelMessage } from '../entities/channel-message.entity';
import { Message } from '../entities/message.entity';
import { UsersService } from '../users/users.service';
import { ChannelUserPermission } from '../entities/channel-user-permission.entity';

const BAN_HOURS = 1;

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelUserPermission)
    private readonly channelUserPermissionsRepository: Repository<ChannelUserPermission>,
    @InjectRepository(ChannelMessage)
    private readonly channelMessageRepository: Repository<ChannelMessage>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return await this.channelsRepository.find({ order: { name: 'DESC' } });
  }

  async findChannelById(id: number, relations: Array<string> = []) {
    return await this.channelsRepository.findOne({ id }, { relations });
  }

  async findChannelByChannelIdAndUserId(channelId: number, userId: number) {
    return await this.channelUserPermissionsRepository.findOne({
      channelId,
      userId,
    });
  }

  async findChannelsByUserId(userId: number) {
    return await this.channelUserPermissionsRepository.find({
      where: { userId },
      relations: ['user', 'channel'],
    });
  }

  async findChannelsByChannelId(channelId: number) {
    return await this.channelUserPermissionsRepository.find({
      where: { channelId },
      relations: ['user', 'channel'],
    });
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

  async create(channelData: NewChannel, userId: number) {
    if (channelData.password) {
      channelData.password = await bcrypt.hash(
        channelData.password,
        Number(process.env.HASH_SALT),
      );
    }
    const channel = await this.channelsRepository.save(channelData);
    const channelUserPermission = new ChannelUserPermission();
    channelUserPermission.channelId = channel.id;
    channelUserPermission.channel = channel;
    channelUserPermission.userId = userId;
    channelUserPermission.role = 'owner';
    return this.channelUserPermissionsRepository.save(channelUserPermission);
  }

  async join(channel: Channel, userId: number, password?: string) {
    if (
      channel.password &&
      !(await bcrypt.compare(password, channel.password))
    ) {
      return null;
    }
    await this.channelUserPermissionsRepository.upsert(
      {
        channelId: channel.id,
        userId,
      },
      ['channelId', 'userId'],
    );
    return await this.channelUserPermissionsRepository.findOne(
      { userId, channelId: channel.id },
      { relations: ['user', 'channel'] },
    );
  }

  async updateUserPermissions(channelId: number, channelUserData: ChannelUser) {
    const permission: Pick<ChannelUserPermission, 'role' | 'ban_until'> = {
      role: channelUserData.role,
      ban_until: null,
    };
    if (channelUserData.is_ban) {
      const ban_until = new Date();
      ban_until.setHours(ban_until.getHours() + BAN_HOURS);
      permission.ban_until = ban_until;
    }
    await this.channelUserPermissionsRepository.update(
      { channelId, userId: channelUserData.user.id },
      { ...permission },
    );
  }
}
