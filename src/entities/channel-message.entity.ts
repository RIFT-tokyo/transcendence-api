import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel)
  channel: Channel;

  @ManyToOne(() => User)
  user: User;

  @Column()
  text: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  deleted_at: Date | null;
}
