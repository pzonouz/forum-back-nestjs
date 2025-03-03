import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsOptional()
  id: string;
  @MinLength(5)
  @IsString()
  title: string;

  @MinLength(10)
  @IsString()
  description: string;

  @IsOptional()
  solved: boolean;

  @IsOptional()
  @IsArray()
  filenames: string[];

  userId: string;
}
