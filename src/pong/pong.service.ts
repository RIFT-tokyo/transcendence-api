import { Injectable } from '@nestjs/common';

type Vector = [number, number, number];
type BallState = {
  position: Vector;
  speed: number;
  direction: Vector;
}

const X = 0;
const Y = 1;
const Z = 2;

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

    if (ballState.direction[X] > 10)
  }
}
