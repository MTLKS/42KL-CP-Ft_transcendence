import { Controller, Get, Post, Body, Res, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	handleData(@Body() data: any): any {
		return this.authService.handleData(data);
	}

	/* TEMP REQUEST */
	@Get()
	getLogin(@Headers() headers: any) : string {
		return this.authService.checkSession(headers);
	}

	// Receive code from 42 OAuth
	@Post('code')
	receiveCode(@Body() data: any, @Res( { passthrough: true} ) response: Response): any {
		return this.authService.receiveCode(data, response);
	}
}
