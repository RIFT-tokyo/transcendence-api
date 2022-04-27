import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DM } from './dm.entity';
import { User } from './user.entity';

@Entity()
export class DMMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DM, (dm) => dm.messages)
  dm: DM;

  @ManyToOne(() => User)
  from_user: User;

  @ManyToOne(() => User)
  to_user: User;

  @Column()
  text: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: Date;
}
