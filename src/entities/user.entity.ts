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

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ default: '', nullable: false })
  display_name: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: false, default: 'offline' })
  status_message: 'online' | 'offline' | 'game';

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: string;
}
