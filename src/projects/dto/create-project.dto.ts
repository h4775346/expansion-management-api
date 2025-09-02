import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsNumber()
  budget: number;

  @IsOptional()
  @IsIn(['active', 'completed', 'cancelled'])
  status: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services_needed: string[];
}