import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateResearchDocDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}