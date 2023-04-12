import { Injectable, Param, Headers } from "@nestjs/common";

@Injectable()
export class AuthService {
	// Starts the login process
	startLogin(@Headers() header: any): any {
		const COOKIES = header.cookie ? header.cookie.split("; ") : [];
		if (COOKIES.length !== 0) {
			const ACCESS_TOKEN = COOKIES.find((cookie) => cookie.startsWith('access_token=')).split('=')[1];
			if (ACCESS_TOKEN)
				return { redirectUrl: "http://localhost:5173" };
		}
		const LINK = "https://api.intra.42.fr/oauth/authorize/";
		const REDIRECT_URI = "http%3A%2F%2Flocalhost%3A5173"
		return { redirectUrl: LINK + "?client_id=" + process.env.APP_UID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code"};
	}

	// Use the code from query to get token info
	async getCode(@Param('code') code: string): Promise<any> {
		const DATA = {
			"grant_type": "authorization_code",
			"client_id": process.env.APP_UID,
			"client_secret": process.env.APP_SECRET,
			"code": code,
			"redirect_uri": "http://localhost:5173"
		};
		const API_RESPONSE = await fetch("https://api.intra.42.fr/oauth/token", {
			method: 'POST',
			headers:{ 'Content-Type': 'application/json' },
			body : JSON.stringify(DATA),
		});
		return await API_RESPONSE.json();
	}
}