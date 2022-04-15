import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from './users/users.service';
import { User } from './generated/model/models';

@WebSocketGateway({ cors: true, namespace: '/' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  handleConnection(@ConnectedSocket() client: Socket) {
    const userID = client.handshake.auth.userID;
    console.log(`Client connected: ${userID}`);
    this.updateUserStatus('online', userID);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userID = client.handshake.auth.userID;
    console.log(`Client DISconnected: ${userID}`);
    this.updateUserStatus('offline', userID);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong');
  }
}
