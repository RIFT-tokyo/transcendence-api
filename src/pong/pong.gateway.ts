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
  private readonly GOAL_POINT = 3000;

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
    this.pongService.createRoom(userId, roomId);
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
    this.pongService.joinUser(userId, roomId);
    client.join(roomId);
    client.emit('match:join', { isSucceeded: true });
  }

  @SubscribeMessage('match:ready')
  handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: string },
  ): void {
    const userId = client.handshake.auth.userID;
    const state = this.pongService.getRoom(roomId);
    if (!state) {
      return;
    }
    const canGameStart = this.pongService.setReady(roomId, userId);
    if (canGameStart) {
      this.pongService.createGame(roomId);
      this.server
        .to(roomId)
        .emit('match:start', new ResponseMatchDTO(state.match));
    }
  }

  // gain point in the match
  // @SubscribeMessage('match:gain-point')
  // async handleGainPoint(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() body: { roomId: string; userId: number },
  // ) {
  //   const status = this.roomIdStates.get(body.roomId);
  //   if (!status) {
  //     throw Error();
  //   }
  //   const match = await this.matchesService.gainPoint(
  //     status.match.id,
  //     status.users.host.id === body.userId,
  //   );
  //   this.server
  //     .to(body.roomId)
  //     .emit('match:status', new ResponseMatchDTO(match));
  //   if (
  //     match.host_player_points >= this.GOAL_POINT ||
  //     match.guest_player_points >= this.GOAL_POINT
  //   ) {
  //     this.server.to(body.roomId).emit('match:finish', {});
  //     this.roomIdStates.delete(body.roomId);
  //   } else {
  //     status.match = match;
  //   }
  // }

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
    }: { roomId: string; position: [number, number, number] },
  ) {
    const userId = client.handshake.auth.userID;
    this.pongService.setPlayerPosition(roomId, userId, position);

    client.broadcast.emit('pong:enemy-position', position);
    // const status = this.roomIdStates.get(roomId);
    // if (!status) {
    //   throw Error();
    // }
    // const isHost = userId === status.users.host.id;
    // if (!status.obtainer) {
    //   // 座標の処理(衝突)
    //   let pongStatus = this.pongService.calcPosition(roomId, isHost, position);
    //   // 点数判定処理
    //   status.obtainer = this.pongService.isBallInGoalArea(pongStatus.ball);
    //   // 点数加算をMatchesServiceに
    //   if (status.obtainer) {
    //     const match = await this.matchesService.gainPoint(
    //       status.match.id,
    //       status.obtainer === 'host',
    //     );
    //     this.server
    //       .to(roomId)
    //       .emit('match:status', new ResponseMatchDTO(match));
    //     if (
    //       match.host_player_points >= this.GOAL_POINT ||
    //       match.guest_player_points >= this.GOAL_POINT
    //     ) {
    //       this.server.to(roomId).emit('match:finish', {});
    //       this.roomIdStates.delete(roomId);
    //     } else {
    //       status.match = match;
    //       pongStatus = this.pongService.resetBallPosition(roomId);
    //     }
    //   }
    //   this.server.to(roomId).emit('pong:position', pongStatus);
    //   status.obtainer = null;
    // }
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
      }
    });
  }

  // TODO: handleDisconnectを検知して、相手のゲームを終了させる
}
