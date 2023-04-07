import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

	@Get()
	getHello(@Res() res: any): any {
		return this.authService.startLogin(res);
	}
}
