import { Channel } from '../generated/model/channel';
import { Channel as EntityChannel } from '../entities/channel.entity';
import { NewChannel } from '../generated/model/newChannel';
import { v4 as uuidv4 } from 'uuid';

export class CreateChannelDTO implements NewChannel {
  name: string;
  slug: string;
  password?: string;

  constructor(channel: NewChannel) {
    this.name = channel.name;
    this.slug = `${channel.name}-${uuidv4()}`;
    this.password = channel.password;
  }
}

export class ResponseChannelDTO implements Channel {
  id: number;
  name: string;
  slug: string;
  is_protected: boolean;
  created_at?: string;
  updated_at?: string;

  constructor(channel: EntityChannel) {
    this.id = channel.id;
    this.name = channel.name;
    this.slug = channel.slug;
    this.is_protected = !!channel.password;
    this.created_at = channel.created_at.toISOString();
    this.updated_at = channel.updated_at.toISOString();
  }
}
