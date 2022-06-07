import { ChannelsService } from './channels.service';
import { Inject } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

interface SendMessageBody {
  text: string;
  userID: number;
  channelID: number;
}

interface JoinChannelBody {
  channelID: number;
}

@WebSocketGateway({ cors: true, namespace: '/channels' })
export class ChannelsGateway {
  @Inject()
  channelsService: ChannelsService;

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message:send')
  async handleSendMessage(@MessageBody() body: SendMessageBody) {
    const channelMessage = await this.channelsService.createMessage(
      body.userID,
      body.channelID,
      body.text,
    );
    this.server.to(String(body.channelID)).emit('message:receive', {
      message: {
        id: channelMessage.id,
        channelID: body.channelID,
        text: channelMessage.message.text,
        user: channelMessage.user,
        createdAt: channelMessage.created_at.getTime(),
      },
    });
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
    this.server.to(client.id).emit('message:receive-all', {
      messages: channel.messages.map((msg) => {
        return {
          id: msg.id,
          text: msg.message.text,
          user: msg.user,
          createdAt: msg.created_at.getTime(),
        };
      }),
    });
  }

  @SubscribeMessage('channel:leave')
  async handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinChannelBody,
  ) {
    client.leave(String(body.channelID));
  }
}
