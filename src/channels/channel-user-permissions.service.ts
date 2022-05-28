import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUserPermission } from 'src/entities/channel-user-permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelUserPermissionsService {
  constructor(
    @InjectRepository(ChannelUserPermission)
    private readonly channelUsersRepository: Repository<ChannelUserPermission>,
  ) {}

}
