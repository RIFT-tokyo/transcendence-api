import { Role } from '../generated';
import { ResponseUserDTO } from '../users/users.dto';
import { ChannelUser } from '../generated/model/channelUser';
import { ChannelUserPermission } from '../entities/channel-user-permission.entity';

export class ChannelUserDTO implements ChannelUser {
  user: ResponseUserDTO;
  role: Role;

  constructor(channelUserPermission: ChannelUserPermission) {
    this.user = new ResponseUserDTO(channelUserPermission.user);
    this.role = channelUserPermission.role;
  }
}
