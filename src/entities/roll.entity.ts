import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Roll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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
