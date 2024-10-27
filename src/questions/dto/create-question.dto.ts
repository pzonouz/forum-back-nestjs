import { IsString, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateQuestionDto {
  @MinLength(5)
  @IsString()
  title: string;

  @MinLength(10)
  @IsString()
  description: string;

  user: User;
}
