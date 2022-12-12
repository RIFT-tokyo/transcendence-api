import { Inject, Injectable, Logger } from '@nestjs/common';
import { Obtainer, RoomState, Vector } from '../types/Pong';
import { MatchesService } from '../matches/matches.service';
import { Match } from '../entities/match.entity';
import { Interval } from '@nestjs/schedule';

const X = 0;
const Y = 1;
const Z = 2;

const STAGE_X = 7.6;
const STAGE_Z = 20;

const PADDLE_X = 2;
const PADDLE_Z = 0.4;

const BALL_RADIUS = 0.2;
const NORM = 0.14;

@Injectable()
export class PongService {
  private roomIdStates = new Map<string, RoomState>();
  private readonly logger = new Logger('PongService');

  private autoMatchRoomId: string | null = null;

  @Inject()
  private readonly matchesService: MatchesService;

  getRoom(roomId: string): RoomState {
    return this.roomIdStates.get(roomId);
  }

  initDirection(): Vector {
    const min = 0.5;
    const max = 0.9;
    const randomSign = () => (Math.random() > 0.5 ? 1 : -1);
    const dirX = (Math.random() * (max - min) + min) * NORM;
    const dirZ = Math.sqrt(NORM * NORM - dirX * dirX);
    return [randomSign() * dirX, 0, randomSign() * dirZ];
  }

  async createRoom(
    hostUserId: number,
    roomId: string | null = null,
  ): Promise<string> {
    const match = await this.matchesService.create({
      host_player_id: hostUserId,
    });
    const newRoomId = roomId ?? Math.random().toString(32).substring(2, 15);
    this.roomIdStates.set(newRoomId, {
      match: match,
      users: {
        host: { id: hostUserId, isReady: false },
        guest: { id: null, isReady: false },
      },
    });
    return newRoomId;
  }

  async joinUser(userId: number, roomId: string): Promise<string> {
    const status = this.getRoom(roomId);
    const match = await this.matchesService.joinUser(status.match.id, userId);
    status.match = match;
    status.users.guest.id = userId;
    return roomId;
  }

  async autoMatch(userId: number): Promise<string> {
    if (this.autoMatchRoomId === null) {
      this.autoMatchRoomId = await this.createRoom(userId);
      return this.autoMatchRoomId;
    } else {
      const roomId = this.autoMatchRoomId;
      this.autoMatchRoomId = null;
      await this.joinUser(userId, roomId);
      return roomId;
    }
  }

  async setReady(roomId: string, userId: number): Promise<boolean> {
    const state = this.getRoom(roomId);
    if (state.users.host.id === userId) {
      state.users.host.isReady = true;
    } else {
      state.users.guest.isReady = true;
    }

    const allPlayerReady =
      state.users.host.isReady && state.users.guest.isReady;
    if (allPlayerReady) {
      state.match = await this.matchesService.startGame(state.match.id);
    }
    return allPlayerReady;
  }

  createGame(roomId: string): void {
    const state = this.getRoom(roomId);
    state.hostPosition = [0, 0, 0];
    state.guestPosition = [0, 0, 0];
    state.ballState = {
      position: [0, 0, 0],
      speed: 2,
      direction: this.initDirection(),
    };
  }

  setPlayerPosition(roomId: string, userId: number, position: Vector): boolean {
    const state = this.getRoom(roomId);
    if (!state) {
      return false;
    }
    const isHost = state.users.host.id === userId;
    if (isHost) {
      state.hostPosition = position;
    } else {
      state.guestPosition = position;
    }
    return true;
  }

  isBallInGoalArea(ballPosition: Vector): Obtainer {
    if (STAGE_Z / 2 <= ballPosition[Z]) {
      return 'guest';
    }
    if (-STAGE_Z / 2 >= ballPosition[Z]) {
      return 'host';
    }
    return null;
  }

  calcBallPosition(roomState: RoomState): RoomState {
    roomState.ballState.position[X] +=
      roomState.ballState.direction[X] * roomState.ballState.speed;
    roomState.ballState.position[Z] +=
      roomState.ballState.direction[Z] * roomState.ballState.speed;

    if (roomState.ballState.direction[X] > roomState.ballState.speed * 2) {
      roomState.ballState.direction[X] = roomState.ballState.speed * 2;
    } else if (
      roomState.ballState.direction[X] <
      -roomState.ballState.speed * 2
    ) {
      roomState.ballState.direction[X] = -roomState.ballState.speed * 2;
    }

    // 壁に当たったら反射
    if (roomState.ballState.position[X] <= -(STAGE_X / 2 - BALL_RADIUS)) {
      roomState.ballState.direction[X] = -roomState.ballState.direction[X];
    }
    if (roomState.ballState.position[X] >= STAGE_X / 2 - BALL_RADIUS) {
      roomState.ballState.direction[X] = -roomState.ballState.direction[X];
    }

    // roomState.hostPosition[Z] - PADDLE_Z / 2 - BALL_RADIUS <= roomState.ballState.position[Z] <= roomState.hostPosition[Z] - BALL_RADIUS
    // ぱどるにあたったら反射
    // z方向
    if (
      roomState.hostPosition[Z] - PADDLE_Z / 2 - BALL_RADIUS <=
        roomState.ballState.position[Z] &&
      roomState.ballState.position[Z] <=
        roomState.hostPosition[Z] + PADDLE_Z / 4 - BALL_RADIUS
    ) {
      // x方向
      if (
        roomState.ballState.position[X] <=
          roomState.hostPosition[X] + PADDLE_X / 2 &&
        roomState.ballState.position[X] >=
          roomState.hostPosition[X] - PADDLE_X / 2
      ) {
        // ボールはホストに向かっているか
        if (roomState.ballState.direction[Z] > 0) {
          const abs = Math.abs(roomState.ballState.direction[Z]);
          roomState.ballState.direction[Z] = -(
            abs +
            Math.log(abs > 1 ? abs * 1.1 : 1.1) * 0.01
          );
        }
      }
    }
    // roomState.guestPosition[Z] + BALL_RADIUS <= roomState.ballState.position[Z] <= roomState.guestPosition[Z] + BALL_RADIUS + PADDLE_Z / 2
    // z方向
    if (
      roomState.guestPosition[Z] - PADDLE_Z / 4 + BALL_RADIUS <=
        roomState.ballState.position[Z] &&
      roomState.ballState.position[Z] <=
        roomState.guestPosition[Z] + BALL_RADIUS + PADDLE_Z / 2
    ) {
      // x方向
      if (
        roomState.ballState.position[X] <=
          roomState.guestPosition[X] + PADDLE_X / 2 &&
        roomState.ballState.position[X] >=
          roomState.guestPosition[X] - PADDLE_X / 2
      ) {
        // ボールはゲストに向かっているか
        if (roomState.ballState.direction[Z] < 0) {
          // roomState.ballState.direction[Z] = -roomState.ballState.direction[Z] * 1.1;
          const abs = Math.abs(roomState.ballState.direction[Z]);
          roomState.ballState.direction[Z] =
            abs + Math.log(abs > 1 ? abs * 1.1 : 1.1) * 0.01;
        }
      }
    }
    return roomState;
  }

  getBallPositions(): Map<string, { obtainer: Obtainer; position: Vector }> {
    const res: Map<string, { obtainer: Obtainer; position: Vector }> =
      new Map();

    this.roomIdStates.forEach((gameState, roomId) => {
      if (gameState.match.start_at && !gameState.match.end_at) {
        gameState = this.calcBallPosition(gameState);
        const obtainer = this.isBallInGoalArea(gameState.ballState.position);
        if (obtainer) {
          gameState.ballState = {
            position: [0, 0, 0],
            speed: 2,
            direction: this.initDirection(),
          };
        }
        res.set(roomId, {
          obtainer: obtainer,
          position: gameState.ballState.position,
        });
      }
    });

    return res;
  }

  async gainPoint(roomId: string, isHost: boolean): Promise<Match> {
    const status = await this.getRoom(roomId);
    if (!status) {
      throw Error();
    }
    const match = await this.matchesService.gainPoint(status.match.id, isHost);
    if (match.end_at) {
      this.roomIdStates.delete(roomId);
    } else {
      status.match = match;
    }
    return match;
  }

  async handlePlayerDisconnect(roomId: string, userId: number, status: string) {
    const roomStatus = await this.getRoom(roomId);
    if (!roomStatus) {
      return;
    }
    const isHost = roomStatus.users.host.id === userId;

    if ((status === 'waiting' || status === 'back_to_top') && isHost) {
      this.roomIdStates.delete(roomId);
      if (roomId === this.autoMatchRoomId) {
        this.autoMatchRoomId = null;
      }
    }
  }

  @Interval(3000)
  debugRoom(): void {
    this.logger.debug('********************************************');
    this.roomIdStates.forEach((state, key) => {
      this.logger.debug(`${key}: ${JSON.stringify(state)}`);
    });
  }
}
