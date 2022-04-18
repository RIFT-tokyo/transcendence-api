import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { DM } from './dm.entity';
import { User } from './user.entity';

@Entity()
export class DMMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @RelationId((dm: DM) => dm.id)
  dm_id: number;

  @ManyToOne(() => User)
  from_user: User;

  @ManyToOne(() => User)
  to_user: User;

  @Column()
  text: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
