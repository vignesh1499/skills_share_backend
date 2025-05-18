import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Skill } from "./skills.entity";

@Entity("tasks")
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  task_name: string;

  @Column("text")
  description: string;

  @Column({ type: "date" })
  expected_start_date: string;

  @Column("int")
  expected_working_hours: number;

  @Column("decimal", { precision: 10, scale: 2 })
  hourly_rate: number;

  @Column({
    type: "enum",
    enum: ["USD", "AUD", "SGD", "INR"],
    default: "USD",
  })
  rate_currency: string;

  @Column({ type: "boolean", default: false })
  task_completed: boolean;

  // Accepted User
  @Column("uuid", { nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  acceptedUser: User | null;

  // Provider
  @Column("uuid", { nullable: true })
  providerId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "providerId" })
  provider: User | null;

  // Skill
  @Column({ nullable: true })
  skillId: number | null;

  @ManyToOne(() => Skill, { eager: true, nullable: true })
  @JoinColumn({ name: "skillId" })
  skill: Skill | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
