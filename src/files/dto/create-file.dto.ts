import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateFileDto {
  @IsString()
  filename: string;

  @IsString()
  @IsOptional()
  title: string;

  user: User;
}
