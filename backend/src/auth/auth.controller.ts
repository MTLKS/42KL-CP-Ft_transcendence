import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	@Post()
	handleData(@Body() data: any): any {
		console.log(data);
	
		const response = { message: 'Received data successfully' };
		return response;
	  }

	@Get()
	getLogin() : string
	{
		return ("Successfully get");
	}
}
