import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

type Vector = [number, number, number];
type BallState = {
  position: Vector;
  speed: number;
  direction: Vector;
};
type GameState = {
  hostPosition: Vector;
  guestPosition: Vector;
  ballState: BallState;
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
  private roomIdStates = new Map<string, GameState>();
  private readonly logger = new Logger('PongService');
  createGame(roomId: string): void {
    const game: GameState = {
      hostPosition: [0, 0, 0],
      guestPosition: [0, 0, 0],
      ballState: INITIAL_BALL_STATE,
    };
    this.roomIdStates.set(roomId, game);
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

    gameState.ballState.position[X] +=
      gameState.ballState.direction[X] * gameState.ballState.speed;
    gameState.ballState.position[Z] +=
      gameState.ballState.direction[Z] * gameState.ballState.speed;

    if (gameState.ballState.direction[X] > gameState.ballState.speed * 2) {
      gameState.ballState.direction[X] = gameState.ballState.speed * 2;
    } else if (
      gameState.ballState.direction[X] <
      -gameState.ballState.speed * 2
    ) {
      gameState.ballState.direction[X] = -gameState.ballState.speed * 2;
    }

    // 壁に当たったら反射
    if (gameState.ballState.position[X] <= -(STAGE_X / 2 - BALL_RADIUS)) {
      gameState.ballState.direction[X] = -gameState.ballState.direction[X];
    }
    if (gameState.ballState.position[X] >= STAGE_X / 2 - BALL_RADIUS) {
      gameState.ballState.direction[X] = -gameState.ballState.direction[X];
    }

    // ぱどるにあたったら反射
    // z方向
    if (
      gameState.ballState.position[Z] <= gameState.hostPosition[Z] + PADDLE_Z &&
      gameState.ballState.position[Z] >= gameState.hostPosition[Z]
    ) {
      // x方向
      if (
        gameState.ballState.position[X] <=
          gameState.hostPosition[X] + PADDLE_X / 2 &&
        gameState.ballState.position[X] >=
          gameState.hostPosition[X] - PADDLE_X / 2
      ) {
        // ボールはホストに向かっているか
        if (gameState.ballState.direction[Z] > 0) {
          const abs = Math.abs(gameState.ballState.direction[Z]);
          gameState.ballState.direction[Z] = -(
            abs +
            Math.log(abs > 1 ? abs * 1.1 : 1.1) * 0.01
          );
        }
      }
    }
    // z方向
    if (
      gameState.ballState.position[Z] <=
        gameState.guestPosition[Z] + PADDLE_Z &&
      gameState.ballState.position[Z] >= gameState.guestPosition[Z]
    ) {
      // x方向
      if (
        gameState.ballState.position[X] <=
          gameState.guestPosition[X] + PADDLE_X / 2 &&
        gameState.ballState.position[X] >=
          gameState.guestPosition[X] - PADDLE_X / 2
      ) {
        // ボールはゲストに向かっているか
        if (gameState.ballState.direction[Z] < 0) {
          // gameState.ballState.direction[Z] = -gameState.ballState.direction[Z] * 1.1;
          const abs = Math.abs(gameState.ballState.direction[Z]);
          gameState.ballState.direction[Z] =
            abs + Math.log(abs > 1 ? abs * 1.1 : 1.1) * 0.01;
        }
      }
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

  @Interval(1000)
  handleInterval() {
    this.logger.debug('Called every 1 seconds');
  }
}
