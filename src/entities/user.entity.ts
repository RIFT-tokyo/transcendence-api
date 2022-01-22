import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: string;
}
