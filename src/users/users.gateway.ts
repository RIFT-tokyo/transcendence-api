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

@WebSocketGateway({ cors: true, namespace: '/users' })
export class UsersGateway {
  @Inject()
  usersService: UsersService;

  @WebSocketServer()
  server: Server;

  async updateUserStatus(status: User.StatusEnum, userID: number) {
    await this.usersService.updateUser(userID, { status: status });
    this.server.emit('userStatus', {
      status: status,
      userID,
    });
  }

  @SubscribeMessage('userStatus')
  handleUserStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    const userID = client.handshake.auth.userID;
    this.updateUserStatus(body.status, userID);
  }
}
