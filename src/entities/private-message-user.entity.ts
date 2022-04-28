import { IsDate } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PrivateMessageUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  from_user: User;

  @ManyToMany(() => User)
  @JoinTable()
  to_users: User[];

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
