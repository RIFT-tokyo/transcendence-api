import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUserPermission } from '../entities/channel-user-permission.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChannelsService } from './channels.service';
import { NewChannel } from '../generated';
import { Role } from 'src/entities/role.entity';

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

  async create(channelData: NewChannel, userId: number) {
    const channel = await this.channelService.create(channelData);
    const channelUserPermission = new ChannelUserPermission();
    channelUserPermission.channelId = channel.id;
    channelUserPermission.channel = channel;
    channelUserPermission.userId = userId;
    const role = new Role();
    role.id = 1;
    role.name = 'owner';
    channelUserPermission.role = role;
    return this.channelUserPermissionsRepository.save(channelUserPermission);
  }

  async join(channelId: number, userId: number, password: string) {
    const channel = await this.channelService.findById(channelId);
    if (!channel) {
      return null;
    }
    if (
      channel.password &&
      !(await bcrypt.compare(password, channel.password))
    ) {
      return null;
    }
    await this.channelUserPermissionsRepository.insert({
      channelId,
      userId,
    });
    return await this.channelUserPermissionsRepository.findOne(
      { userId, channelId },
      { relations: ['user', 'channel', 'role'] },
    );
  }

  async leave(channelId: number, userId: number) {
    return await this.channelUserPermissionsRepository.softDelete({
      channelId,
      userId,
    });
  }
}
