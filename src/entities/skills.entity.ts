import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user?.skills)
  provider: User;

  @Column()
  category: string;

  @Column('int')
  experience: number;

  @Column({ type: 'varchar' })
  nature_of_work: 'onsite' | 'online';

  @Column('decimal', { precision: 10, scale: 2 })
  hourly_rate: number;

  @ManyToOne(() => User, user => user.skills, { eager: true })
  @JoinColumn({ name: 'providerId' })
  createdBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
