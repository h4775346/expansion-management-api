import { IsOptional, IsString } from 'class-validator';

export class SearchResearchDocDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}