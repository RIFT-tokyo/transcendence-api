import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { ChannelUserPermission } from '../entities/channel-user-permission.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  CreateChannelUserPermissionDTO,
  UpdateChannelUserPermissionDTO,
} from './channel-user-permissions.dto';
import { ChannelsService } from './channels.service';
import { NewChannel } from '../generated';

@Injectable()
export class ChannelUserPermissionsService {
  constructor(
    @InjectRepository(ChannelUserPermission)
    private readonly channelUserPermissionsRepository: Repository<ChannelUserPermission>,
    private readonly channelService: ChannelsService,
  ) {}

  async findByUserId(userId: number) {
    return await this.channelUserPermissionsRepository.find({
      where: { userId },
      relations: ['user', 'channel', 'role'],
    });
  }

  async findByChannelId(channelId: number) {
    return await this.channelUserPermissionsRepository.find({
      where: { channelId },
      relations: ['user', 'channel', 'role'],
    });
  }

  async create(channelData: NewChannel, userId: number) {
    const channel = new Channel();
    channel.name = channelData.name;
    if (channelData.password) {
      channel.name = await bcrypt.hash(
        channelData.password,
        Number(process.env.HASH_SALT),
      );
    }
    const channelUserPermission = new ChannelUserPermission();
    channelUserPermission.channel = channel;
    channelUserPermission.userId = userId;
    channelUserPermission.role.id = 1;
    channelUserPermission.role.name = 'owner';
    return this.channelUserPermissionsRepository.save(channelUserPermission);
  }

  async join(channelUser: CreateChannelUserPermissionDTO) {
    const channel = await this.channelService.findById(channelUser.channelId);
    if (!channel) {
      return null;
    }
    if (
      channel.password &&
      !(await bcrypt.compare(channel.password, channelUser.password))
    ) {
      return null;
    }
    await this.channelUserPermissionsRepository.insert(channelUser);
    return await this.channelUserPermissionsRepository.findOne(
      { userId: channelUser.userId, channelId: channelUser.channelId },
      { relations: ['user', 'channel', 'role'] },
    );
  }

  async leave(channelId: number, userId: number) {
    return await this.channelUserPermissionsRepository.softDelete({
      channelId,
      userId,
    });
  }

  async update(
    channelId: number,
    userId: number,
    channelUser: UpdateChannelUserPermissionDTO,
  ) {
    await this.channelUserPermissionsRepository.update(
      { channelId, userId },
      channelUser,
    );
    return await this.channelUserPermissionsRepository.findOne(
      { channelId, userId },
      { relations: ['user', 'channel', 'role'] },
    );
  }
}
