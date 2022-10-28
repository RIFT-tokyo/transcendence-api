import { ChannelUserPermission as EntityChannelUserPermission } from '../entities/channel-user-permission.entity';
import { Channel as EntityChannel } from '../entities/channel.entity';
import { ChannelMessage } from '../entities/channel-message.entity';
import { Channel } from '../generated/model/channel';
import { PrivateMessage } from 'src/entities/private-message.entity';
import { Role } from '../generated/model/role';
import { ChannelUser } from '../generated/model/channelUser';
import { User } from '../generated/model/user';
import { ResponseUserDTO } from '../users/users.dto';

export class ResponseChannelDTO implements Channel {
  id: number;
  name: string;
  is_protected: boolean;
  role: Role | null;
  created_at?: string;
  updated_at?: string;

  constructor(channel: EntityChannel, userId: number);
  constructor(channelUserPermission: EntityChannelUserPermission);
  constructor(
    arg: EntityChannel | EntityChannelUserPermission,
    userId?: number,
  ) {
    if (arg instanceof EntityChannel) {
      const role = arg.users?.find((v) => v.userId === userId)?.role ?? null;

      this.id = arg.id;
      this.name = arg.name;
      this.is_protected = !!arg.password;
      this.role = role;
      this.created_at = arg.created_at.toISOString();
      this.updated_at = arg.created_at.toISOString();
    } else {
      this.id = arg.channel.id;
      this.name = arg.channel.name;
      this.is_protected = !!arg.channel.password;
      this.role = arg.role;
      this.created_at = arg.channel.created_at.toISOString();
      this.updated_at = arg.channel.updated_at.toISOString();
    }
  }
}

export class WSResponseMessageDTO {
  id: number;
  text: string;
  createdAt: Date;
  user: {
    id: number;
    username: string;
    profile_image: string;
    display_name: string;
  };

  constructor(message: ChannelMessage | PrivateMessage) {
    if (message instanceof ChannelMessage) {
      this.id = message.message.id;
      this.text = message.message.text;
      this.createdAt = message.message.created_at;
      this.user = {
        id: message.user.id,
        username: message.user.username,
        profile_image: message.user.profile_image,
        display_name: message.user.display_name,
      };
    } else {
      this.id = message.message.id;
      this.text = message.message.text;
      this.createdAt = message.message.created_at;
      this.user = {
        id: message.from_user.id,
        username: message.from_user.username,
        profile_image: message.from_user.profile_image,
        display_name: message.from_user.display_name,
      };
    }
  }
}

export class ChannelUserDTO implements ChannelUser {
  user: ResponseUserDTO;
  role: Role;
  is_ban: boolean;

  constructor(
    channelUserPermission: EntityChannelUserPermission,
    now: Date = new Date(),
  ) {
    this.user = new ResponseUserDTO(channelUserPermission.user);
    this.role = channelUserPermission.role;
    this.is_ban =
      channelUserPermission.ban_until !== null &&
      channelUserPermission.ban_until > now;
  }
}

export class CreateChannelUserPermissionDTO {
  userId: number;
  channelId: number;
  role?: Role;
  password?: string;
}

export class ResponseChannelUserDTO implements ChannelUser {
  user: User;
  role: Role;

  constructor(channelUser: EntityChannelUserPermission) {
    this.user = new ResponseUserDTO(channelUser.user);
    this.role = channelUser.role;
  }
}
