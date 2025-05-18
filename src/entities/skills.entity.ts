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

export type NatureOfWork = 'onsite' | 'online';
export type SkillStatus = 'open' | 'accepted' | 'completed' | 'rejected' | null;

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  // Provider who creates the skill
  @ManyToOne(() => User, user => user.skills, { eager: true })
  @JoinColumn({ name: 'providerId' })
  provider: User;

  // User who accepts the skill (optional)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  acceptedBy?: User | null | undefined;

  @Column()
  category: string;

  @Column('int')
  experience: number;

  @Column({ type: 'varchar' })
  nature_of_work: NatureOfWork;

  @Column('decimal', { precision: 10, scale: 2 })
  hourly_rate: number;

  @Column({ type: 'varchar', default: null, nullable:true })
  status: SkillStatus;

  @Column({ type: 'boolean', default: false })
  completion: boolean;

  @Column({ type: 'boolean', default: false })
  approval: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
