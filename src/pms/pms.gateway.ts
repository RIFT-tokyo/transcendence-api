import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WSResponseMessageDTO } from 'src/channels/channels.dto';
import { PmsService } from './pms.service';

interface SendMessageBody {
  text: string;
  fromUserId: number;
  toUserId: number;
}

interface JoinPmBody {
  fromUserId: number;
  toUserId: number;
}

interface ServerToClientEvents {
  'message:receive': (message: WSResponseMessageDTO) => void;
  'message:receive-all': (messages: WSResponseMessageDTO[]) => void;
}

@WebSocketGateway({ cors: true, namespace: '/pms' })
export class PmsGateway {
  @Inject()
  pmsService: PmsService;

  @WebSocketServer()
  server: Server<ServerToClientEvents>;

  @SubscribeMessage('message:send')
  async handleSendMessage(@MessageBody() body: SendMessageBody) {
    const privateMessage = await this.pmsService.createMessage(
      body.fromUserId,
      body.toUserId,
      body.text,
    );
    this.server
      .to(String(body.toUserId))
      .emit('message:receive', new WSResponseMessageDTO(privateMessage));
  }

  @SubscribeMessage('pm:join')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinPmBody,
  ) {
    client.join(String(body.toUserId));
    const messages = await this.pmsService.findAllPrivateMessages(
      body.fromUserId,
      body.toUserId,
    );
    this.server.to(client.id).emit(
      'message:receive-all',
      messages.map((msg) => new WSResponseMessageDTO(msg)),
    );
  }

  @SubscribeMessage('pm:leave')
  async handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinPmBody,
  ) {
    client.leave(String(body.toUserId));
  }
}
