import { IsDate } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class PrivateMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  from_user: User;

  @ManyToOne(() => User)
  to_user: User;

  @OneToOne(() => Message)
  @JoinColumn()
  message: Message;

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
