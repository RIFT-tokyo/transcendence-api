import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from './users.service';
import { User } from '../generated/model/models';

@WebSocketGateway({ cors: true })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @Inject()
  usersService: UsersService;

  @WebSocketServer()
  server: Server;

  private userID;

  async updateUserStatus(status: User.StatusEnum) {
    await this.usersService.updateUser(this.userID, { status: status });
    this.server.emit('userStatus', {
      status: status,
      userID: this.userID,
    });
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.userID = client.handshake.auth.userID;
    console.log(`Client connected: ${this.userID}`);
    this.updateUserStatus('online');
  }

  handleDisconnect() {
    console.log(`Client DISconnected: ${this.userID}`);
    this.updateUserStatus('offline');
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong');
  }

  @SubscribeMessage('userStatus')
  handleUserStatus(@MessageBody() body: any) {
    this.updateUserStatus(body.status);
  }
}
