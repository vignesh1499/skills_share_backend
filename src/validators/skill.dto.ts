import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

import { NatureOfWork, SkillStatus } from '../entities/skills.entity';

export class SkillDto {

  @IsNumber()
  id: number;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  experience: number;

  @IsEnum(['onsite', 'online'], {
    message: 'nature_of_work must be either "onsite" or "online"',
  })
  nature_of_work: NatureOfWork;

  @IsNumber()
  @Min(0)
  hourly_rate: number;

  @IsOptional()
  @IsEnum(['open', 'accepted', 'completed', 'rejected', null], {
    message: 'status must be one of "open", "accepted", "completed", "rejected", or null',
  })
  status?: SkillStatus;

  @IsOptional()
  @IsBoolean()
  completion?: boolean;

  @IsOptional()
  @IsBoolean()
  approval?: boolean;

  // Optional userId if needed when accepting a skill
  @IsOptional()
  @IsString()
  userId?: string;

  // Optional providerId if assigning skill manually (if needed)
  @IsOptional()
  @IsString()
  providerId?: string;
}
