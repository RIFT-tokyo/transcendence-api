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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'host_player_id' })
  host_player: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'guest_player_id' })
  guest_player: User | null;

  @Column({ default: 0 })
  host_player_points: number;

  @Column({ default: 0 })
  guest_player_points: number;

  @Column({ type: 'enum', enum: Result, default: Result.DRAW })
  result: Result;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsDate()
  start_at: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsDate()
  end_at: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: Date;
}
