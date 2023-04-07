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

	getLogin() : void {

		//Redirect to the 42 oauth
		
		console.log("sucessfully login");
		console.log(this.getRedirectLink())
		//Get access token


		//Get user data with token


		//Check user already has account
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

	// async getAccessToken(code)

	//Get the link to the 42oauth
	getRedirectLink():string
	{
		const link = "https://api.intra.42.fr/oauth/authorize/";
		const clientID = 
		"u-s4t2ud-f4e9a7e43d31ba873132848534cb2ce3c8208fe4ae57e8be9b3f270a17c4f350";
		const redirect_uri = "http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect"

		return (link + "?client_id=" + clientID + "&redirect_uri=" + redirect_uri + "&response_type=code");
	}

	//Use the code from query to get token info
	async getTokenInfo(code : string) : Promise<any>
	{
		const data = {
			"grant_type" : "authorization_code",
			"client_id" : "u-s4t2ud-f4e9a7e43d31ba873132848534cb2ce3c8208fe4ae57e8be9b3f270a17c4f350",
			"client_secret" : "secret",
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