import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @Get()
  getHello(@Headers() headers: any): string {
    return this.authService.checkSession(headers);
  }
}
