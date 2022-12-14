import { Inject, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MatchesService } from '../matches/matches.service';
import { Server, Socket } from 'socket.io';
import { ResponseMatchDTO } from '../matches/match.dto';
import { PongService } from './pong.service';
import { Obtainer, Vector } from '../types/Pong';

@WebSocketGateway({ cors: true, namespace: '/pong' })
export class PongGateway {
  @Inject()
  private readonly matchesService: MatchesService;
  @Inject()
  private readonly pongService: PongService;

  private readonly logger = new Logger('PongGateway');

  @WebSocketServer()
  server: Server;

  autoMatchRoomId: string | null = null;

  // create match
  @SubscribeMessage('match:create')
  async handleNewRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ): Promise<void> {
    const userId = client.handshake.auth.userID;
    if (!roomId || this.pongService.getRoom(roomId)) {
      client.emit('match:create', { isSucceeded: false, roomId: null });
      return;
    }
    await this.pongService.createRoom(userId, roomId);
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
    const status = this.pongService.getRoom(roomId);
    if (!status || status.users.guest.id) {
      client.emit('match:join', { isSucceeded: false });
      return;
    }
    await this.pongService.joinUser(userId, roomId);
    client.join(roomId);
    client.emit('match:join', { isSucceeded: true });
  }

  @SubscribeMessage('match:watch')
  handleWatchRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ): void {
    const match = this.pongService.addWatcher(roomId);
    if (!match) {
      client.emit('match:watch', { isSucceeded: false });
    }
    client.join(roomId);
    client.emit('match:watch', { isSucceeded: true, match: match });
  }

  @SubscribeMessage('match:ready')
  async handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ): Promise<void> {
    const userId = client.handshake.auth.userID;
    const state = this.pongService.getRoom(roomId);
    if (!state) {
      return;
    }
    const canGameStart = await this.pongService.setReady(roomId, userId);
    if (canGameStart) {
      this.pongService.createGame(roomId);
      this.server
        .to(roomId)
        .emit('match:start', new ResponseMatchDTO(state.match));
    }
  }

  @SubscribeMessage('match:auto')
  async handleAutoMatch(@ConnectedSocket() client: Socket): Promise<void> {
    const userId = client.handshake.auth.userID;
    const roomId = await this.pongService.autoMatch(userId);
    client.join(roomId);
    client.emit('match:auto', {
      isSucceeded: true,
      roomId: roomId,
    });
  }

  @SubscribeMessage('pong:my-position')
  async handlePaddlePosition(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      roomId,
      position,
      isHost,
    }: { roomId: string; position: [number, number, number]; isHost: boolean },
  ) {
    const userId = client.handshake.auth.userID;
    const isSuccess = this.pongService.setPlayerPosition(
      roomId,
      userId,
      position,
    );

    if (isSuccess) {
      client.broadcast.emit('pong:player-position', {
        isHost: isHost,
        position: position,
      });
    }
  }

  @SubscribeMessage('pong:leave')
  handlePlayerDisconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { roomId, status }: { roomId: string; status: string },
  ) {
    const userId = client.handshake.auth.userID;
    this.pongService.handlePlayerDisconnect(roomId, userId, status);
    client.leave(roomId);
  }

  @Interval(1000 / 30)
  handleInterval() {
    const ballPositions: Map<string, { obtainer: Obtainer; position: Vector }> =
      this.pongService.getBallPositions();
    ballPositions.forEach(async (ballPosition, roomId) => {
      this.server.to(roomId).emit('pong:ball-position', ballPosition.position);
      if (ballPosition.obtainer) {
        const match = await this.pongService.gainPoint(
          roomId,
          ballPosition.obtainer === 'host',
        );
        this.server
          .to(roomId)
          .emit('match:status', new ResponseMatchDTO(match));
        if (match.end_at) {
          // TODO: 勝者の累積勝敗数を数えて、アチーブメントの付与を行う(job, queue, task)
          this.pongService.addAchievement(match.host_player.id);
          this.pongService.addAchievement(match.guest_player.id);
          this.server.to(roomId).emit('match:finish', {});
        }
      }
    });
  }
}
