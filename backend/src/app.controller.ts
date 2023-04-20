import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

	@Get()
	startLogin(@Headers() header: any): any {
		return this.authService.startLogin(header);
	}
}
