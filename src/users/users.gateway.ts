import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from './users.service';
import { User } from '../generated/model/models';

interface UserStatusBody {
  status: User.StatusEnum;
  userID: number;
}

interface ServerToClientEvents {
  'user-status:receive': (status: User.StatusEnum, userID: number) => void;
}

@WebSocketGateway({ cors: true, namespace: '/users' })
export class UsersGateway {
  @Inject()
  usersService: UsersService;

  @WebSocketServer()
  server: Server<ServerToClientEvents>;

  updateUserStatus(status: User.StatusEnum, userID: number) {
    this.usersService.updateUser(userID, { status: status });
    this.server.emit('user-status:receive', status, userID);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    const userID = client.handshake.auth.userID;
    this.updateUserStatus('online', userID);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userID = client.handshake.auth.userID;
    this.updateUserStatus('offline', userID);
  }

  @SubscribeMessage('user-status:set')
  handleUserStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: UserStatusBody,
  ) {
    const userID = client.handshake.auth.userID;
    this.updateUserStatus(body.status, userID);
  }
}
