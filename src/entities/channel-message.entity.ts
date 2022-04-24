import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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
  created_at: Date;
}
