import { IsString } from 'class-validator';

class ResetPasswordCallbackDto {
  @IsString()
  password: string;

  @IsString()
  token: string;
}
export { ResetPasswordCallbackDto };
