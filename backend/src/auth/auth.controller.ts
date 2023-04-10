import { Controller, Get, Post, Param, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService, 
		private readonly userService: UserService
		) {}

	@Get()
	startLogin(@Headers() header): any {
		return this.authService.startLogin(header);
	}

	@Post("/accessToken/:code")
	async getCookie(@Param('code') code: string): Promise<any> {
		const RESPONSE_DATA = await this.authService.getCookie(code);
		const ACCESS_TOKEN = RESPONSE_DATA["access_token"];
		console.log(ACCESS_TOKEN);
		const USER_DTO = await this.userService.getUserData(ACCESS_TOKEN);
		console.log(USER_DTO);
		return this.authService.getCookie(code);
	}
}
