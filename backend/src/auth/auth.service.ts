import { Injectable, Body, Headers, Res } from "@nestjs/common";
import { Response } from "express";
import { type } from "os";

@Injectable()
export class AuthService {
	private myArray = new Array();

	checkSession(@Headers() headers: any): any {
		if (headers.cookie && this.myArray.includes(headers.cookie.split('=')[1])) {
			return "You have logged in before";
		}
		return "You are a new user!";
	}

	handleData(@Body() data: any): any {
		console.log(data);
		return { message: "Received data successfully" };
	}

	getLogin(): string {
		return "Successfully get login";
	}

	receiveCode(@Body() data: any, @Res() response: Response): any {
		if (this.myArray.includes(data.code) == false) {
			this.myArray.push(data.code);
		}
		response.cookie('access_token', data.code, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60,
		});
		return this.myArray;
	}
}