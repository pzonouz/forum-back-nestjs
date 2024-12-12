import { IsEmail, IsString } from 'class-validator';

class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}
export { ResetPasswordDto };
