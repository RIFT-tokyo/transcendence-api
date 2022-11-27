import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { MatchesService } from '../matches/matches.service';
import { Match } from '../entities/match.entity';

type Vector = [number, number, number];
type BallState = {
  position: Vector;
  speed: number;
  direction: Vector;
};

type UserStatus = {
  id: number | null;
  isReady: boolean;
};

type RoomState = {
  hostPosition?: Vector;
  guestPosition?: Vector;
  ballState?: BallState;
  match?: Match | null;
  users?: {
    host: UserStatus;
    guest: UserStatus;
  };
  obtainer?: 'host' | 'guest' | null;
};

type Obtainer = 'host' | 'guest' | null;

const X = 0;
const Y = 1;
const Z = 2;

const STAGE_X = 7.6;
const STAGE_Z = 20;

const PADDLE_X = 2;
const PADDLE_Z = 0.4;

const BALL_RADIUS = 0.2;
const INITIAL_BALL_STATE: BallState = {
  position: [0, 0, 0],
  speed: 1.1,
  direction: [0.01, 0, 0.01],
};

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
      obtainer: null,
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

  setReady(roomId: string, userId: number): boolean {
    const state = this.getRoom(roomId);
    if (state.users.host.id === userId) {
      state.users.host.isReady = true;
    } else {
      state.users.guest.isReady = true;
    }
    return state.users.host.isReady && state.users.guest.isReady;
  }

  createGame(roomId: string): void {
    const state = this.getRoom(roomId);
    state.hostPosition = [0, 0, 0];
    state.guestPosition = [0, 0, 0];
    state.ballState = INITIAL_BALL_STATE;
  }

  setPlayerPosition(roomId: string, userId: number, position: Vector) {
    const state = this.getRoom(roomId);
    const isHost = state.users.host.id === userId;
    if (isHost) {
      state.hostPosition = position;
    } else {
      state.guestPosition = position;
    }
  }

  calcPosition(
    roomId: string,
    isHost: boolean,
    position: Vector,
  ): {
    host: Vector;
    guest: Vector;
    ball: Vector;
  } {
    const gameState = this.roomIdStates.get(roomId);
    if (!gameState) {
      throw new Error();
    }
    if (isHost) {
      gameState.hostPosition = position;
    } else {
      gameState.guestPosition = position;
    }
    return {
      host: gameState.hostPosition,
      guest: gameState.guestPosition,
      ball: gameState.ballState.position,
    };
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

  resetBallPosition(roomId: string) {
    const gameState = this.roomIdStates.get(roomId);
    if (!gameState) {
      throw new Error();
    }
    gameState.ballState = INITIAL_BALL_STATE;
    return {
      host: gameState.hostPosition,
      guest: gameState.guestPosition,
      ball: gameState.ballState.position,
    };
  }

  // @Interval(1000 / 60)
  // handleInterval() {
  //   this.roomIdStates.forEach((gameState) => {
  //     gameState.ballState.position[X] +=
  //       gameState.ballState.direction[X] * gameState.ballState.speed;
  //     gameState.ballState.position[Z] +=
  //       gameState.ballState.direction[Z] * gameState.ballState.speed;

  //     if (gameState.ballState.direction[X] > gameState.ballState.speed * 2) {
  //       gameState.ballState.direction[X] = gameState.ballState.speed * 2;
  //     } else if (
  //       gameState.ballState.direction[X] <
  //       -gameState.ballState.speed * 2
  //     ) {
  //       gameState.ballState.direction[X] = -gameState.ballState.speed * 2;
  //     }

  //     // 壁に当たったら反射
  //     if (gameState.ballState.position[X] <= -(STAGE_X / 2 - BALL_RADIUS)) {
  //       gameState.ballState.direction[X] = -gameState.ballState.direction[X];
  //     }
  //     if (gameState.ballState.position[X] >= STAGE_X / 2 - BALL_RADIUS) {
  //       gameState.ballState.direction[X] = -gameState.ballState.direction[X];
  //     }

  //     // ぱどるにあたったら反射
  //     // z方向
  //     if (
  //       gameState.ballState.position[Z] <=
  //         gameState.hostPosition[Z] + PADDLE_Z &&
  //       gameState.ballState.position[Z] >= gameState.hostPosition[Z]
  //     ) {
  //       // x方向
  //       if (
  //         gameState.ballState.position[X] <=
  //           gameState.hostPosition[X] + PADDLE_X / 2 &&
  //         gameState.ballState.position[X] >=
  //           gameState.hostPosition[X] - PADDLE_X / 2
  //       ) {
  //         // ボールはホストに向かっているか
  //         if (gameState.ballState.direction[Z] > 0) {
  //           const abs = Math.abs(gameState.ballState.direction[Z]);
  //           gameState.ballState.direction[Z] = -(
  //             abs +
  //             Math.log(abs > 1 ? abs * 1.1 : 1.1) * 0.01
  //           );
  //         }
  //       }
  //     }
  //     // z方向
  //     if (
  //       gameState.ballState.position[Z] <=
  //         gameState.guestPosition[Z] + PADDLE_Z &&
  //       gameState.ballState.position[Z] >= gameState.guestPosition[Z]
  //     ) {
  //       // x方向
  //       if (
  //         gameState.ballState.position[X] <=
  //           gameState.guestPosition[X] + PADDLE_X / 2 &&
  //         gameState.ballState.position[X] >=
  //           gameState.guestPosition[X] - PADDLE_X / 2
  //       ) {
  //         // ボールはゲストに向かっているか
  //         if (gameState.ballState.direction[Z] < 0) {
  //           // gameState.ballState.direction[Z] = -gameState.ballState.direction[Z] * 1.1;
  //           const abs = Math.abs(gameState.ballState.direction[Z]);
  //           gameState.ballState.direction[Z] =
  //             abs + Math.log(abs > 1 ? abs * 1.1 : 1.1) * 0.01;
  //         }
  //       }
  //     }
  //   });
  // }
}
