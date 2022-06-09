import { ChannelUserPermission } from '../entities/channel-user-permission.entity';
import { Channel as EntityChannel } from '../entities/channel.entity';
import { Channel } from '../generated/model/channel';
import { Role } from '../generated/model/role';

export class ResponseChannelDTO implements Channel {
  id: number;
  name: string;
  is_protected: boolean;
  role: Role;
  created_at?: string;
  updated_at?: string;

  constructor(channel: EntityChannel, userId: number);
  constructor(channelUserPermission: ChannelUserPermission);
  constructor(arg: EntityChannel | ChannelUserPermission, userId?: number) {
    if (arg instanceof EntityChannel) {
      const role = arg.users.find((v) => v.userId === userId)?.role ?? null;

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
