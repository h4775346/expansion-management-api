import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  response_sla_hours: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries: string[];
}