import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) {
    if (!['customer','admin'].includes(dto.role)) throw new Error('Only customer/admin registration allowed');
    return this.auth.register(dto);
  }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto); }
}
