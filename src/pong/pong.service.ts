import { Injectable } from '@nestjs/common';

type Vector = [number, number, number];
type BallState = {
  position: Vector;
  speed: number;
  direction: Vector;
};

const X = 0;
const Y = 1;
const Z = 2;

const STAGE_X = 8.4;
const STAGE_Z = 20;

const PADDLE_X = 20;
const PADDLE_Z = 0.4;

@Injectable()
export class PongService {
  calcBallPosition(
    hostPosition: Vector,
    guestPosition: Vector,
    ballState: BallState,
  ) {
    ballState.position[X] += ballState.direction[X] * ballState.speed;
    ballState.position[Z] += ballState.direction[Z] * ballState.speed;

    if (ballState.direction[X] > ballState.speed * 2) {
      ballState.direction[X] = ballState.speed * 2;
    } else if (ballState.direction[X] < -ballState.speed * 2) {
      ballState.direction[X] = -ballState.speed * 2;
    }

    // 壁に当たったら反射
    if (ballState.position[X] <= -STAGE_X / 2) {
      ballState.direction[X] = -ballState.direction[X];
    }
    if (ballState.position[X] >= STAGE_X / 2) {
      ballState.direction[X] = -ballState.direction[X];
    }

    // ぱどるにあたったら反射
    // z方向
    if (
      ballState.position[Z] <= hostPosition[Z] + PADDLE_Z &&
      ballState.position[Z] >= hostPosition[Z]
    ) {
      // x方向
      if (
        ballState.position[X] <= hostPosition[X] + PADDLE_X / 2 &&
        ballState.position[X] >= hostPosition[X] - PADDLE_X / 2
      ) {
        // ボールはホストに向かっているか
        if (ballState.direction[Z] > 0) {
          ballState.direction[Z] = -ballState.direction[Z];
        }
      }
    }
    // z方向
    if (
      ballState.position[Z] <= guestPosition[Z] + PADDLE_Z &&
      ballState.position[Z] >= guestPosition[Z]
    ) {
      // x方向
      if (
        ballState.position[X] <= guestPosition[X] + PADDLE_X / 2 &&
        ballState.position[X] >= guestPosition[X] - PADDLE_X / 2
      ) {
        // ボールはホストに向かっているか
        if (ballState.direction[Z] < 0) {
          ballState.direction[Z] = -ballState.direction[Z];
        }
      }
    }
  }
}
