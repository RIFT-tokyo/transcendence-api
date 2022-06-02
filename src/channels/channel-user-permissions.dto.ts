import { Channel, ChannelUserPermission, Role, User } from 'src/generated';
import { ResponseUserDTO } from 'src/users/users.dto';
import { ChannelUserPermission as EntityChannelUserPermission } from '../entities/channel-user-permission.entity';
import { ResponseChannelDTO } from './channels.dto';

export class CreateChannelUserPermissionDTO {
  userId: number;
  channelId: number;
  is_ban: boolean;
  role?: Role;
}

export class UpdateChannelUserPermissionDTO {
  is_ban?: boolean;
  role?: Role;
}

export class ResponseChannelUserPermissionDTO implements ChannelUserPermission {
  channel: Channel;
  user: User;
  is_ban: boolean;
  role: Role;
  created_at?: string;
  updated_at?: string;

  constructor(channelUser: EntityChannelUserPermission) {
    this.channel = new ResponseChannelDTO(channelUser.channel);
    this.user = new ResponseUserDTO(channelUser.user);
    this.is_ban = channelUser.is_ban;
    this.role = channelUser.role;
    this.created_at = channelUser.created_at.toISOString();
    this.updated_at = channelUser.updated_at.toISOString();
  }
}
