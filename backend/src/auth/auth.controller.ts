import { Controller, Get, Post, Param, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

	@Get()
	startLogin(@Headers() header: any): any {
		return this.authService.startLogin(header);
	}

	@Post("/code/:code")
	async getCode(@Param('code') code: string): Promise<any> {
		return this.authService.getCode(code);
	}
}
