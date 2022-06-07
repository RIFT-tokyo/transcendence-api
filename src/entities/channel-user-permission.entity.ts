import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity()
export class ChannelUserPermission {
  @PrimaryColumn()
  channelId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Channel, (channel: Channel) => channel.users)
  channel: Channel;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsDate()
  ban_until: Date;

  @ManyToOne(() => Role, { nullable: true })
  role: Role;

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
