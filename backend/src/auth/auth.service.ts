import { Injectable, Param, Headers, Response } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) {}

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
	async postCode(@Param('code') code: string): Promise<any> {
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
		const RETURN_DATA = await API_RESPONSE.json();
		if (RETURN_DATA.access_token != null) {
			const ENTITY_USER = new User();
			ENTITY_USER.accessToken = RETURN_DATA.access_token;
			const USER_DTO = await this.userService.getMyIntraData(ENTITY_USER.accessToken);
			ENTITY_USER.intraId = USER_DTO.id;
			ENTITY_USER.tfaSecret = null;
			this.userRepository.save(ENTITY_USER);
		}
		return RETURN_DATA;
	}
}