import { ChannelUserPermission, Role } from '../generated';
import { ChannelUserPermission as EntityChannelUserPermission } from '../entities/channel-user-permission.entity';

export class CreateChannelUserPermissionDTO {
  userId: number;
  channelId: number;
  role?: Role;
  password?: string;
}

export class UpdateChannelUserPermissionDTO {
  ban_until: Date | null;
  role: Role;

  constructor(channelUserPermission: ChannelUserPermission) {
    this.ban_until = null;
    if (channelUserPermission.is_ban) {
      const ban_until = new Date();
      ban_until.setHours(ban_until.getHours() + 1);
      this.ban_until = ban_until;
    }
    this.role = channelUserPermission.role;
  }
}

export class ResponseChannelUserPermissionDTO implements ChannelUserPermission {
  is_ban: boolean;
  role: Role;

  constructor(channelUser: EntityChannelUserPermission) {
    this.is_ban = channelUser.ban_until
      ? channelUser.ban_until < new Date()
      : false;
    this.role = channelUser.role;
  }
}
