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
import { WSResponseMessagelDTO } from './channels.dto';

interface SendMessageBody {
  text: string;
  userID: number;
  channelID: number;
}

interface JoinChannelBody {
  channelID: number;
}

interface ServerToClientEvents {
  'message:receive': (message: WSResponseMessagelDTO) => void;
  'message:receive-all': (messages: WSResponseMessagelDTO[]) => void;
}

@WebSocketGateway({ cors: true, namespace: '/channels' })
export class ChannelsGateway {
  @Inject()
  channelsService: ChannelsService;

  @WebSocketServer()
  server: Server<ServerToClientEvents>;

  @SubscribeMessage('message:send')
  async handleSendMessage(@MessageBody() body: SendMessageBody) {
    const channelMessage = await this.channelsService.createMessage(
      body.userID,
      body.channelID,
      body.text,
    );
    this.server
      .to(String(body.channelID))
      .emit('message:receive', new WSResponseMessagelDTO(channelMessage));
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
    this.server.to(client.id).emit(
      'message:receive-all',
      channel.messages.map((msg) => new WSResponseMessagelDTO(msg)),
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
