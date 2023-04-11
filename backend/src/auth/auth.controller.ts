import { Controller, Get, Post, Param, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	startLogin(@Headers() header: any): any {
		return this.authService.startLogin(header);
	}

	@Post(":code")
	async postCode(@Param('code') code: string): Promise<any> {
		return this.authService.postCode(code);
	}
}
