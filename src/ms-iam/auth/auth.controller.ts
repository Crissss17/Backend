import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('check-token')
  async checkToken(@Body() tokenDto: TokenDto) {
    return this.authService.checkToken(tokenDto.token);
  }

  @Post('refresh-token')
  async refreshToken(@Body() tokenDto: TokenDto) {
    return this.authService.refreshToken(tokenDto.token);
  }
}
