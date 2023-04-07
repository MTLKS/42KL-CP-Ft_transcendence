import { Injectable, Body, Headers, Res } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class AuthService {
	private myArray = new Array();

	// Redirects to 42 OAuth
	startLogin(@Res() res): void {
		const link = "https://api.intra.42.fr/oauth/authorize/";
		const redirect_uri = "http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect"

		res.redirect(302, link + "?client_id=" + process.env.APP_UID + "&redirect_uri=" + redirect_uri + "&response_type=code");
	}

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

	// Use the code from query to get token info
	async getTokenInfo(code : string) : Promise<any> {
		const data = {
			"grant_type" : "authorization_code",
			"client_id" : process.env.APP_UID,
			"client_secret" : process.env.APP_SECRET,
			"code" : code,
			"redirect_uri" : "http://localhost:3000/auth/redirect"
		};
		
		const response = await fetch("https://api.intra.42.fr/oauth/token", {
			method : 'POST',
			headers :{
				'Content-Type': 'application/json',
			},
			body : JSON.stringify(data),
		});
		const responseData = await response.json();
		console.log(responseData);
    	return responseData;
	}
}