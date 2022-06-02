import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUserPermission } from 'src/entities/channel-user-permission.entity';
import { Repository } from 'typeorm';
import {
  CreateChannelUserPermissionDTO,
  UpdateChannelUserPermissionDTO,
} from './channel-user-permissions.dto';

@Injectable()
export class ChannelUserPermissionsService {
  constructor(
    @InjectRepository(ChannelUserPermission)
    private readonly channelUsersRepository: Repository<ChannelUserPermission>,
  ) {}

  async findByUserId(userId: number) {
    return await this.channelUsersRepository.find({
      where: { userId },
      relations: ['user', 'channel', 'role'],
    });
  }

  async findByChannelId(channelId: number) {
    return await this.channelUsersRepository.find({
      where: { channelId },
      relations: ['user', 'channel', 'role'],
    });
  }

  async create(channelUser: CreateChannelUserPermissionDTO) {
    await this.channelUsersRepository.insert(channelUser);
    return await this.channelUsersRepository.findOne(
      { userId: channelUser.userId, channelId: channelUser.channelId },
      { relations: ['user', 'channel', 'role'] },
    );
  }

  async delete(channelId: number, userId: number) {
    return await this.channelUsersRepository.softDelete({ channelId, userId });
  }

  async update(
    channelId: number,
    userId: number,
    channelUser: UpdateChannelUserPermissionDTO,
  ) {
    await this.channelUsersRepository.update(
      { channelId, userId },
      channelUser,
    );
    return await this.channelUsersRepository.findOne(
      { channelId, userId },
      { relations: ['user', 'channel', 'role'] },
    );
  }
}
