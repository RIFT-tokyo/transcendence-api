import { Channel } from '../generated/model/channel';
import { Channel as EntityChannel } from '../entities/channel.entity';

export class ResponseChannelDTO implements Channel {
  id: number;
  name: string;
  is_protected: boolean;
  created_at?: string;
  updated_at?: string;

  constructor(channel: EntityChannel) {
    this.id = channel.id;
    this.name = channel.name;
    this.is_protected = !!channel.password;
    this.created_at = channel.created_at.toISOString();
    this.updated_at = channel.updated_at.toISOString();
  }
}
