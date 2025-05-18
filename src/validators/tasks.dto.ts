import { IsString, IsOptional, IsUUID, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';

export class TaskDto {
  @IsOptional()
  @IsNumber()
  taskId?: number;

  @IsString()
  category: string;

  @IsString()
  task_name: string;

  @IsString()
  description: string;

  @IsDateString()
  expected_start_date: string;

  @IsNumber()
  expected_working_hours: number;

  @IsNumber()
  hourly_rate: number;

  @IsEnum(["USD", "AUD", "SGD", "INR"])
  rate_currency: string;

  @IsOptional()
  @IsBoolean()
  task_completed?: boolean;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsUUID()
  skillId?: number;

  // 🔽 ADD THIS FIELD to fix the error
  @IsOptional()
  @IsUUID()
  userId?: string;
}
