import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsDate } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: true })
  @Exclude()
  password: string | null;

  @Column({ unique: true, nullable: true })
  @Exclude()
  intra_id: number | null;

  @Column({ nullable: true })
  display_name: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: false, default: 'offline' })
  status: 'online' | 'offline' | 'game';

  @Column({ nullable: true })
  status_message: string;

  // https://github.com/typeorm/typeorm/issues/1511#issuecomment-360707084
  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: string;
}
