import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: string;
}
