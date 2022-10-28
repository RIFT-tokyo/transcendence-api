import { Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MatchesService } from '../matches/matches.service';
import { Server, Socket } from 'socket.io';
import { CreateMatchDTO } from '../matches/match.dto';
import { Match, Result } from '../entities/match.entity';

type WaitingStatus = {
  id: number | undefined;
  isReady: boolean;
};

type PongMatch = {
  id: number;
  match: Match | null;
  users: {
    host: WaitingStatus;
    guest: WaitingStatus;
  };
};

@WebSocketGateway({ cors: true, namespace: '/pong' })
export class PongGateway {
  @Inject()
  private readonly logger = new Logger('PongGateway');
  private readonly matchesService: MatchesService;

  @WebSocketServer()
  server: Server;
  roomIdStates = new Map<string, PongMatch>();

  // create match
  @SubscribeMessage('match:create')
  async handleNewRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateMatchDTO,
  ): Promise<void> {
    const newRoomId = Math.random().toString(36).substr(2, 9);
    const match = await this.matchesService.create(body);
    this.roomIdStates.set(newRoomId, {
      id: 0,
      match,
      users: {
        host: { id: body.host_player_id, isReady: false },
        guest: { id: undefined, isReady: false },
      },
    });
    client.join(newRoomId);
    client.emit('match:create', { isSucceeded: true, roomId: newRoomId });
  }

  // join match
  @SubscribeMessage('match:join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string; userId: number },
  ): void {
    const status = this.roomIdStates.get(body.roomId);
    if (status) {
      this.roomIdStates.set(body.roomId, {
        id: 0,
        match: status.match,
        users: {
          host: { id: status[0].id, isReady: status[0].isReady },
          guest: { id: body.userId, isReady: false },
        },
      });
    }
    client.emit('match:join', { isSucceeded: true });
  }

  @SubscribeMessage('match:ready')
  handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string; userId: number },
  ): void {
    const state = this.roomIdStates.get(body.roomId);
    if (!state) {
      throw Error();
    }
    if (state.users.host.id === body.userId) {
      state.users.host.isReady = true;
    } else {
      state.users.guest.isReady = true;
    }
    client.emit('match:ready', { isSucceeded: true });
  }

  // // earn point in the match
  @SubscribeMessage('match:get-point')
  handleGainPoint(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string; userId: number },
  ) {
    const state = this.roomIdStates.get(body.roomId);
    if (!state) {
      throw Error();
    }
  }

  // // finish the match
  @SubscribeMessage('match:finish')
  handleFinishGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string },
  ) {
    const state = this.roomIdStates.get(body.roomId);
    this.matchesService.finishGame(state.match);
  }
}
