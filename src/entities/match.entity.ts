import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'host_player_id' })
  host_player: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'guest_player_id' })
  guest_player: User;

  @Column({ nullable: false, default: 0 })
  host_player_points: number;

  @Column({ nullable: false, default: 0 })
  guest_player_points: number;

  @Column({ type: 'enum', enum: Result, default: Result.DRAW })
  result: Result;

  @Column({ type: 'timestamp with time zone' })
  @IsDate()
  start_at: Date;

  @Column({ type: 'timestamp with time zone' })
  @IsDate()
  end_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: Date;
}
