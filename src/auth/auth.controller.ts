import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth-guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SocialSigninDto } from './dto/social-signin-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req: any) {
    return this.authService.signin(req.user);
  }
  @Post('social_signin')
  async socialSignin(@Body() socialSigninDto: SocialSigninDto) {
    const existingUser = await this.userService.findOneEmail(
      socialSigninDto.email,
    );
    if (existingUser) {
      existingUser.firstname = socialSigninDto.firstname;
      existingUser.lastname = socialSigninDto.lastname;
      existingUser.social = true;
      const salt = bcrypt.genSaltSync();
      existingUser.password = bcrypt.hashSync(randomUUID().toString(), salt);
      await this.userService.update(existingUser.id, existingUser);
      return this.authService.signin(existingUser);
    }
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(randomUUID().toString(), salt);
    const user = {
      email: socialSigninDto.email,
      firstname: socialSigninDto.firstname,
      lastname: socialSigninDto.lastname,
      password: password,
      social: true,
    };
    await this.userService.create(user);
    return this.authService.signin(user);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() req: any) {
    return req.user;
  }
}
