import { Inject, Logger } from '@nestjs/common';
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
  fromUserID: number;
  toUserID: number;
}

interface JoinPmBody {
  fromUserID: number;
  toUserID: number;
}

interface ServerToClientEvents {
  'private-message:receive': (message: WSResponseMessageDTO) => void;
  'private-message:receive-all': (messages: WSResponseMessageDTO[]) => void;
}

@WebSocketGateway({ cors: true, namespace: '/pms' })
export class PmsGateway {
  @Inject()
  pmsService: PmsService;

  @WebSocketServer()
  server: Server<ServerToClientEvents>;

  private logger = new Logger('PmsGateway');

  @SubscribeMessage('private-message:send')
  async handleSendMessage(@MessageBody() body: SendMessageBody) {
    const privateMessage = await this.pmsService.createMessage(
      body.fromUserID,
      body.toUserID,
      body.text,
    );
    this.logger.debug(JSON.stringify(privateMessage));
    this.server
      .to(this.getPmID(body.fromUserID, body.toUserID))
      .emit(
        'private-message:receive',
        new WSResponseMessageDTO(privateMessage),
      );
  }

  @SubscribeMessage('pm:join')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinPmBody,
  ) {
    this.logger.debug(body);
    client.join(this.getPmID(body.fromUserID, body.toUserID));
    this.logger.debug(this.getPmID(body.fromUserID, body.toUserID));

    const messages = await this.pmsService.findAllPrivateMessages(
      body.fromUserID,
      body.toUserID,
    );
    this.server.to(client.id).emit(
      'private-message:receive-all',
      messages.map((msg) => new WSResponseMessageDTO(msg)),
    );
    this.logger.debug('--------');
  }

  @SubscribeMessage('pm:leave')
  async handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinPmBody,
  ) {
    client.leave(this.getPmID(body.fromUserID, body.toUserID));
  }

  private getPmID(id1: number, id2: number): string {
    const userIDs = [id1, id2].sort();
    return `${userIDs[0]}-${userIDs[1]}`;
  }
}
