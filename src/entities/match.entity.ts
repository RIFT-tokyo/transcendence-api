import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Result {
  HOST = 'host',
  GUEST = 'guest',
  DRAW = 'draw',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  host_player: User;

  @ManyToOne(() => User)
  guest_player: User;

  @Column({ nullable: false, default: 0 })
  host_player_points: number;

  @Column({ nullable: false, default: 0 })
  guest_player_points: number;

  @Column({ type: 'enum', enum: Result, default: Result.DRAW })
  result: Result;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  start_at: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  end_at: Date;
}
