import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TopVendorsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sinceDays: number = 30;
}