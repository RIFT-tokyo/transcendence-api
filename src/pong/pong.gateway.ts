import { Inject } from '@nestjs/common';
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
  id: number | null;
  isReady: boolean;
};

type PongMatch = {
  match: Match | null;
  users: {
    host: WaitingStatus;
    guest: WaitingStatus;
  };
};

@WebSocketGateway({ cors: true, namespace: '/pong' })
export class PongGateway {
  @Inject()
  // private readonly logger = new Logger('PongGateway');
  private readonly matchesService: MatchesService;

  @WebSocketServer()
  server: Server;

  roomIdStates = new Map<string, PongMatch>();

  // create match
  @SubscribeMessage('match:create')
  async handleNewRoom(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.handshake.auth.userID;
    const newRoomId = Math.random().toString(36).substr(2, 9);
    const match = await this.matchesService.create({
      host_player_id: userId,
      guest_player_id: null,
      host_player_points: null,
      guest_player_points: null,
      result: null
    });
    this.roomIdStates.set(newRoomId, {
      match,
      users: {
        host: { id: userId, isReady: false },
        guest: { id: null, isReady: false },
      },
    });
    client.join(newRoomId);
    client.emit('match:create', { isSucceeded: true, roomId: newRoomId });
  }

  // join match
  @SubscribeMessage('match:join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ): void {
    const userId = client.handshake.auth.userID;
    const status = this.roomIdStates.get(roomId);
    if (status) {
      this.roomIdStates.set(roomId, {
        match: status.match,
        users: {
          host: { id: status[0].id, isReady: status[0].isReady },
          guest: { id: userId, isReady: false },
        },
      });
    }
    client.join(roomId);
    client.emit('match:join', { isSucceeded: true });
  }

  @SubscribeMessage('match:ready')
  handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ): void {
    const userId = client.handshake.auth.userID;
    const state = this.roomIdStates.get(roomId);
    if (!state) {
      throw Error();
    }
    if (state.users.host.id === userId) {
      state.users.host.isReady = true;
    } else {
      state.users.guest.isReady = true;
    }
    client.emit('match:ready', { isSucceeded: true });

    if (state.users.host.isReady && state.users.guest.isReady) {
      this.server
      .to(roomId)
      .emit('match:start', { isSucceeded: true });
    }
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
    // roomをstateから削除する
    const state = this.roomIdStates.get(body.roomId);
    this.matchesService.finishGame(state.match);
  }

  // TODO: handleDisconnectを検知して、相手のゲームを終了させる
}
