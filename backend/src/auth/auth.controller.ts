import { Controller, Get, Post, Body, Req, Res, Headers, Redirect, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { query, Response, Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	
	@Post()
	handleData(@Body() data: any): any {
		return this.authService.handleData(data);
	}

	/* TEMP REQUEST */
	// @Get()
	// getLogin(@Headers() headers: any) : string {
	// 	this.authService.getLogin();
	// 	return this.authService.checkSession(headers);
	// 	// return {url : this.authService.getRedirectLink, statusCode : 302};
	// }

	@Get()
	getLogin(@Res() res) :void
	{
		//redirect to 42 oauth
		res.redirect(302, this.authService.getRedirectLink());
		// this.authService.getLogin();
		// console.log("End of login");
	}

	@Get("/redirect")
	getRedirect(@Query('code') code : string) : string
	{
		//get the code from query
		console.log(code);

		//use the code to get token by sending post request
		this.authService.getTokenInfo(code);

		//get user with token

		//add user to database

		//create session

		//set cookies

		//redirect back
		return ("welcome back");
	}

	// Receive code from 42 OAuth
	@Post('code')
	receiveCode(@Body() data: any, @Res( { passthrough: true} ) response: Response): any {
		return this.authService.receiveCode(data, response);
	}

}


