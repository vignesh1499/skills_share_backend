import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Skill } from "./skills.entity";
import { Tasks } from "./tasks.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ["user", "provider"],
    nullable: false,
  })
  role: "user" | "provider";

  @Column({
    type: "enum",
    enum: ["individual", "company"],
    nullable: false,
    default: "individual",
  })
  type: "individual" | "company";

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  mobile: string;

  @Column({ nullable: true })
  address_street: string;

  @Column({ nullable: true })
  address_city: string;

  @Column({ nullable: true })
  address_state: string;

  @Column({ nullable: true })
  address_post_code: string;

  @Column({ nullable: true })
  address_street_optional?: string;

  @Column({ nullable: true })
  address_city_optional?: string;

  @Column({ nullable: true })
  address_state_optional?: string;

  @Column({ nullable: true })
  address_post_code_optional?: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  company_name?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true, length: 10 })
  business_tax_number?: string;

  @Column({ nullable: true })
  represntative_full_name?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Skill, (skill) => skill.provider)
  skills: Skill[];

  @OneToMany(() => Tasks, (task) => task.provider)
  tasks: Tasks[];

}