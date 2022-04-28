import { IsDate } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { Message } from './message.entity';

@Entity()
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel)
  channel: Channel;

  @OneToOne(() => Message)
  message: Message;

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
