import { IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  filename: string;

  @IsString()
  @IsOptional()
  title: string;
}
