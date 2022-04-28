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
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class PrivateMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  to_user: User;

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
