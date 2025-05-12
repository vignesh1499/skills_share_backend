import {
    IsEnum,
    IsNotEmpty,
    IsString,
    IsDateString,
    IsInt,
    IsNumber,
    IsOptional,
    IsBoolean,
} from 'class-validator';

export class TaskDto {

    @IsOptional()
    @IsNumber()
    taskId?:number


    @IsEnum(['Category1', 'Category2', 'Category3'])
    @IsOptional()
    category?: string = 'Category1';

    @IsString()
    @IsNotEmpty()
    task_name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    expected_start_date: string;

    @IsInt()
    expected_working_hours: number;

    @IsNumber()
    hourly_rate: number;

    @IsEnum(['USD', 'AUD', 'SGD', 'INR'])
    @IsOptional()
    rate_currency?: string = 'USD';

    @IsBoolean()
    @IsOptional()
    task_completed: Boolean

    @IsInt()
    @IsNotEmpty()
    userId: string; // Assuming the user is sending the userId as a reference
}
