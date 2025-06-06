import { DataSource } from "typeorm";
import 'reflect-metadata';
import { User } from "../entities/user.entity";
import { Skill } from "../entities/skills.entity";
import { Tasks } from "../entities/tasks.entity";
import * as dotenv from 'dotenv';

dotenv.config();


export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "4321",
  database: process.env.DB_DATABASE || "skill_share_DB",
  subscribers: [User, Skill, Tasks],
  entities: [User, Skill, Tasks],
  synchronize: true,
  // logging: true,
})
