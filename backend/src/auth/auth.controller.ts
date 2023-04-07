import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	handleData(@Body() data: any): any {
		return this.authService.handleData(data);
	}

	@Get()
	getLogin() : string {
		return this.authService.getLogin();
	}

	// Receive code from 42 OAuth
	@Post('code')
	login(@Body() data: any, @Res( { passthrough: true} ) response: Response): any {
		return this.authService.login(data, response);
	}
}
