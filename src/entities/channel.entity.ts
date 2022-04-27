import { Exclude } from 'class-transformer';
import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelMessage } from './channel-message.entity';
import { ChannelUser } from './channel-user.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  @Exclude()
  password: string | null;

  @OneToMany(() => ChannelMessage, (message: ChannelMessage) => message.channel)
  messages: ChannelMessage[];

  @OneToMany(() => ChannelUser, (user: ChannelUser) => user.channel)
  users: ChannelUser[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: Date;
}
