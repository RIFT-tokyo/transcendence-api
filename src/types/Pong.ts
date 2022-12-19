import { Match } from '../entities/match.entity';

export type Vector = [number, number, number];
export type BallState = {
  position: Vector;
  speed: number;
  direction: Vector;
};

export type UserStatus = {
  id: number | null;
  isReady: boolean;
};

export type RoomState = {
  hostPosition?: Vector;
  guestPosition?: Vector;
  ballState?: BallState;
  match?: Match | null;
  users?: {
    host: UserStatus;
    guest: UserStatus;
  };
};

export type Obtainer = 'host' | 'guest' | null;
