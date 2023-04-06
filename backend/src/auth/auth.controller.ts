import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	private myArray = new Array();

	@Post()
	handleData(@Body() data: any): any {
		return { message: 'Received data successfully' };
	}

	@Get()
	getLogin() : string {
		return ("Successfully get");
	}

	// Receive code from 42 OAuth
	@Post('code')
	login(@Body() data: any, @Res( { passthrough: true} ) response: Response): any {
		this.myArray.push(data);
		response.cookie('access_token', data.code, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60,
		});
		return { message: 'Received code successfully, you should have received a Cookie' };
	}
}
