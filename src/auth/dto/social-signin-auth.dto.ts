import { IsString } from 'class-validator';

class SocialSigninDto {
  @IsString()
  email: string;
  @IsString()
  firstname: string;
  @IsString()
  lastname: string;
}
export { SocialSigninDto };
