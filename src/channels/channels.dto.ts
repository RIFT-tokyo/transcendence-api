import { Channel } from '../generated/model/channel';
import { Channel as EntityChannel } from '../entities/channel.entity';
import { ChannelMessage } from '../entities/channel-message.entity';

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

  constructor(channelMessage: ChannelMessage) {
    this.id = channelMessage.message.id;
    this.text = channelMessage.message.text;
    this.createdAt = channelMessage.message.created_at;
    this.user = {
      id: channelMessage.user.id,
      username: channelMessage.user.username,
      profile_image: channelMessage.user.profile_image,
      display_name: channelMessage.user.display_name,
    };
  }
}
