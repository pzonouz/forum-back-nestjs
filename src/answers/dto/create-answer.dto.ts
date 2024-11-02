import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  questionId: string;

  userId: string;
}
