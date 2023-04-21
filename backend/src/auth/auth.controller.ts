import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	startLogin(@Headers('Authorization') accessToken: any): any {
		return this.authService.startLogin(accessToken);
	}
	
	@Post()
	async postCode(@Body() body: any): Promise<any> {
		return this.authService.postCode(body.code);
	}
}
