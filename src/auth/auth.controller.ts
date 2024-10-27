import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  // BUG:Fix user get from Request
  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() req: any) {
    console.log(req);
    return req.user;
  }
}
