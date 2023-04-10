import { Injectable, Param, Headers } from "@nestjs/common";

@Injectable()
export class AuthService {
	private myArray = new Array();

	// Starts the login process
	startLogin(@Headers() header): any {
		// console.log(header);
		if (header.cookie && this.myArray.includes(header.cookie.split('=')[1])) {
			return { redirectUrl: "http://localhost:5173" };
		} else {
			const LINK = "https://api.intra.42.fr/oauth/authorize/";
			const REDIRECT_URI = "http%3A%2F%2Flocalhost%3A5173"

			return { redirectUrl: LINK + "?client_id=" + process.env.APP_UID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code"};
		}
	}

	// Use the code from query to get token info
	async getCookie(@Param('code') code: string): Promise<any> {
		const DATA = {
			"grant_type": "authorization_code",
			"client_id": process.env.APP_UID,
			"client_secret": process.env.APP_SECRET,
			"code": code,
			"redirect_uri": "http://localhost:5173"
		};
		const API_RESPONSE = await fetch("https://api.intra.42.fr/oauth/token", {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json',
			},
			body : JSON.stringify(DATA),
		});
		const RESPONSE_DATA = await API_RESPONSE.json();
		const ACCESS_TOKEN = RESPONSE_DATA["access_token"];
		this.myArray.push(ACCESS_TOKEN);
    	return RESPONSE_DATA;
	}
}