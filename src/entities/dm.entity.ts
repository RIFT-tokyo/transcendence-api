import { IsDate } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DMMessage } from './dm-message.entity';

@Entity()
export class DM {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => DMMessage, (message: DMMessage) => message.dm)
  messages: DMMessage[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: Date;
}
