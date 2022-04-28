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
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity()
export class ChannelUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, (channel: Channel) => channel.users)
  channel: Channel;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: false })
  is_ban: boolean;

  @ManyToOne(() => Roll)
  roll: Roll;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  @IsDate()
  deleted_at: Date | null;
}
