import { Injectable, Body, Headers, Res } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class AuthService {
	private myArray = new Array();

	checkSession(@Headers() headers: any): string {
		console.log(headers);
		return "Auth Service!";
	}

	handleData(@Body() data: any): any {
		console.log(data);
		return { message: "Received data successfully" };
	}

	getLogin(): string {
		return "Successfully get login";
	}

	login(@Body() data: any, @Res() response: Response): any {
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