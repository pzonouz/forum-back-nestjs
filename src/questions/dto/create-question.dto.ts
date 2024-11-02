import { IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @MinLength(5)
  @IsString()
  title: string;

  @MinLength(10)
  @IsString()
  description: string;

  userId: string;
}
