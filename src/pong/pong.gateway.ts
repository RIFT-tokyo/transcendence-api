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
import { CreateMatchDTO, ResponseMatchDTO } from '../matches/match.dto';
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
  private readonly GOAL_POINT = 3;

  @Inject()
  private readonly matchesService: MatchesService;

  private readonly logger = new Logger('PongGateway');

  @WebSocketServer()
  server: Server;

  roomIdStates = new Map<string, PongMatch>();
  autoMatchRoomId: string | null = null;

  // create match
  @SubscribeMessage('match:create')
  async handleNewRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ): Promise<void> {
    const userId = client.handshake.auth.userID;
    if (!roomId || this.roomIdStates.has(roomId)) {
      client.emit('match:create', { isSucceeded: false, roomId: null });
      return;
    }
    const match = await this.matchesService.create({
      host_player_id: userId,
    });
    this.roomIdStates.set(roomId, {
      match,
      users: {
        host: { id: userId, isReady: false },
        guest: { id: null, isReady: false },
      },
    });
    client.join(roomId);
    client.emit('match:create', { isSucceeded: true, roomId: roomId });
  }

  // join match
  @SubscribeMessage('match:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ): Promise<void> {
    const userId = client.handshake.auth.userID;
    const status = this.roomIdStates.get(roomId);
    if (!status || status.users.guest.id) {
      client.emit('match:join', { isSucceeded: false });
      return;
    }
    const match = await this.matchesService.joinUser(status.match.id, userId);
    this.roomIdStates.set(roomId, {
      match,
      users: {
        host: { id: status.users.host.id, isReady: status.users.host.isReady },
        guest: { id: userId, isReady: false },
      },
    });
    client.join(roomId);
    client.emit('match:join', { isSucceeded: true });
  }

  @SubscribeMessage('match:ready')
  handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ): void {
    const userId = client.handshake.auth.userID;
    const state = this.roomIdStates.get(roomId);
    if (!state) {
      return;
    }
    if (state.users.host.id === userId) {
      state.users.host.isReady = true;
    } else {
      state.users.guest.isReady = true;
    }
    if (state.users.host.isReady && state.users.guest.isReady) {
      this.server
        .to(roomId)
        .emit('match:start', new ResponseMatchDTO(state.match));
    }
  }

  // gain point in the match
  @SubscribeMessage('match:gain-point')
  async handleGainPoint(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string; userId: number },
  ) {
    const state = this.roomIdStates.get(body.roomId);
    if (!state) {
      throw Error();
    }
    const match = await this.matchesService.gainPoint(
      state.match.id,
      state.users.host.id === body.userId,
    );
    this.server
      .to(body.roomId)
      .emit('match:status', new ResponseMatchDTO(match));
    if (
      match.host_player_points >= this.GOAL_POINT ||
      match.guest_player_points >= this.GOAL_POINT
    ) {
      this.server.to(body.roomId).emit('match:finish', {});
      this.roomIdStates.delete(body.roomId);
    } else {
      state.match = match;
    }
  }

  @SubscribeMessage('match:auto')
  async handleAutoMatch(@ConnectedSocket() client: Socket): Promise<void> {
    const userId = client.handshake.auth.userID;
    if (this.autoMatchRoomId === null) {
      this.autoMatchRoomId = Math.random().toString(32).substring(2, 15);
      const match = await this.matchesService.create({
        host_player_id: userId,
      });
      this.roomIdStates.set(this.autoMatchRoomId, {
        match,
        users: {
          host: { id: userId, isReady: false },
          guest: { id: null, isReady: false },
        },
      });
      client.join(this.autoMatchRoomId);
      client.emit('match:auto', {
        isSucceeded: true,
        roomId: this.autoMatchRoomId,
      });
    } else {
      const status = this.roomIdStates.get(this.autoMatchRoomId);
      const match = await this.matchesService.joinUser(status.match.id, userId);
      this.roomIdStates.set(this.autoMatchRoomId, {
        match,
        users: {
          host: {
            id: status.users.host.id,
            isReady: status.users.host.isReady,
          },
          guest: { id: userId, isReady: false },
        },
      });
      client.join(this.autoMatchRoomId);
      client.emit('match:auto', {
        isSucceeded: true,
        roomId: this.autoMatchRoomId,
      });
      this.autoMatchRoomId = null;
    }
  }

  // TODO: handleDisconnectを検知して、相手のゲームを終了させる
}
