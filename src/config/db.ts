import { DataSource } from "typeorm";
 import 'reflect-metadata';
import { User } from "../entities/user.entity";
import { Skill } from "../entities/skills.entity";
import { Tasks } from "../entities/tasks.entity";
import * as dotenv from 'dotenv';

dotenv.config();


export const dataSource = new DataSource({
    type:"postgres",
    host:process.env.API_URL || "localhost",
    port:Number(process.env.DB_PORT || 5432),
    username:process.env.DB_USERNAME || "postgres",
    password:process.env.DB_PASSWORD  || "4321",
    database:process.env.DB_DATABASE || "skill_share_DB",
    subscribers:[User, Skill, Tasks],
    entities:[User, Skill, Tasks],
    synchronize:true,
    logging:true,

    extra: {
    max: Number(process.env.DB_POOL_MAX) || 10,
    min: Number(process.env.DB_POOL_MIN) || 2,
  }
})
