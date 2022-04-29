import { Exclude } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelMessage } from './channel-message.entity';
import { ChannelUserPermission } from './channel-user-permission.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Exclude()
  password: string | null;

  @OneToMany(() => ChannelMessage, (message: ChannelMessage) => message.channel)
  messages: ChannelMessage[];

  @OneToMany(
    () => ChannelUserPermission,
    (user: ChannelUserPermission) => user.channel,
  )
  users: ChannelUserPermission[];

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
