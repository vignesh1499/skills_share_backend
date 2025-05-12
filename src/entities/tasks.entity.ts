import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("tasks")
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ["Category1", "Category2", "Category3"],
    default: "Category1"
  })
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


  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  @JoinColumn({ name: "userId" })
  createdBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
