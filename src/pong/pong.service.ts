import { Injectable } from '@nestjs/common';

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
}

const X = 0;
const Y = 1;
const Z = 2;

const STAGE_X = 8.4;
const STAGE_Z = 20;

const PADDLE_X = 20;
const PADDLE_Z = 0.4;

@Injectable()
export class PongService {
  private roomIdStates = new Map<string, GameState>();

  createGame(roomId: string): void {
    const game: GameState = {
      hostPosition: [0, 0, 0],
      guestPosition: [0, 0, 0],
      ballState: {
        position: [0, 0, 0],
        speed: 1,
        direction: [1, 0, 1],
      }
    }
    this.roomIdStates.set(roomId, game);
  }

  calcBallPosition(
    roomId: string,
    hostPosition: Vector,
    guestPosition: Vector,
  ): Vector {
    const gameState = this.roomIdStates.get(roomId);
    if (!gameState) {
      throw new Error();
    }

    gameState.ballState.position[X] += gameState.ballState.direction[X] * gameState.ballState.speed;
    gameState.ballState.position[Z] += gameState.ballState.direction[Z] * gameState.ballState.speed;

    if (gameState.ballState.direction[X] > gameState.ballState.speed * 2) {
      gameState.ballState.direction[X] = gameState.ballState.speed * 2;
    } else if (gameState.ballState.direction[X] < -gameState.ballState.speed * 2) {
      gameState.ballState.direction[X] = -gameState.ballState.speed * 2;
    }

    // 壁に当たったら反射
    if (gameState.ballState.position[X] <= -STAGE_X / 2) {
      gameState.ballState.direction[X] = -gameState.ballState.direction[X];
    }
    if (gameState.ballState.position[X] >= STAGE_X / 2) {
      gameState.ballState.direction[X] = -gameState.ballState.direction[X];
    }

    // ぱどるにあたったら反射
    // z方向
    if (
      gameState.ballState.position[Z] <= hostPosition[Z] + PADDLE_Z &&
      gameState.ballState.position[Z] >= hostPosition[Z]
    ) {
      // x方向
      if (
        gameState.ballState.position[X] <= hostPosition[X] + PADDLE_X / 2 &&
        gameState.ballState.position[X] >= hostPosition[X] - PADDLE_X / 2
      ) {
        // ボールはホストに向かっているか
        if (gameState.ballState.direction[Z] > 0) {
          gameState.ballState.direction[Z] = -gameState.ballState.direction[Z];
        }
      }
    }
    // z方向
    if (
      gameState.ballState.position[Z] <= guestPosition[Z] + PADDLE_Z &&
      gameState.ballState.position[Z] >= guestPosition[Z]
    ) {
      // x方向
      if (
        gameState.ballState.position[X] <= guestPosition[X] + PADDLE_X / 2 &&
        gameState.ballState.position[X] >= guestPosition[X] - PADDLE_X / 2
      ) {
        // ボールはホストに向かっているか
        if (gameState.ballState.direction[Z] < 0) {
          gameState.ballState.direction[Z] = -gameState.ballState.direction[Z];
        }
      }
    }

    return gameState.ballState.position;
  }
}
