import { ChannelsService } from './channels.service';
import { Inject, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WSResponseMessageDTO } from './channels.dto';

interface SendMessageBody {
  text: string;
  userID: number;
  channelID: number;
}

interface JoinChannelBody {
  channelID: number;
}

interface ServerToClientEvents {
  'message:receive': (message: WSResponseMessageDTO) => void;
  'message:receive-all': (messages: WSResponseMessageDTO[]) => void;
}

@WebSocketGateway({ cors: true, namespace: '/channels' })
export class ChannelsGateway {
  @Inject()
  channelsService: ChannelsService;

  @WebSocketServer()
  server: Server<ServerToClientEvents>;

  private logger = new Logger('ChannelsGateway');

  @SubscribeMessage('message:send')
  async handleSendMessage(@MessageBody() body: SendMessageBody) {
    const channelMessage = await this.channelsService.createMessage(
      body.userID,
      body.channelID,
      body.text,
    );
    const permission =
      await this.channelsService.findChannelByChannelIdAndUserId(
        body.channelID,
        body.userID,
      );
    if (permission.ban_until && permission.ban_until > new Date()) {
      return;
    }
    this.server
      .to(String(body.channelID))
      .emit('message:receive', new WSResponseMessageDTO(channelMessage));
  }

  @SubscribeMessage('channel:join')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinChannelBody,
  ) {
    client.join(String(body.channelID));
    const channel = await this.channelsService.findChannelById(body.channelID, [
      'messages',
      'messages.user',
      'messages.message',
    ]);

    const channelUserPermissions =
      await this.channelsService.findChannelsByChannelId(body.channelID);
    const banIds = channelUserPermissions
      .filter(
        (permission) =>
          permission.ban_until && permission.ban_until > new Date(),
      )
      .map((permission) => permission.user.id);

    this.server.to(client.id).emit(
      'message:receive-all',
      channel.messages
        .filter((msg) => !banIds.includes(msg.user.id))
        .map((msg) => new WSResponseMessageDTO(msg)),
    );
  }

  @SubscribeMessage('channel:leave')
  async handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinChannelBody,
  ) {
    client.leave(String(body.channelID));
  }
}
