import { Controller, Get, Post, Param, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	startLogin(@Headers() header): any {
		return this.authService.startLogin(header);
	}

	@Post("/accessToken/:code")
	getCookie(@Param('code') code: string): any {
		return this.authService.getCookie(code);
	}
}
