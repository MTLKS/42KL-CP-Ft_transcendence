import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) {}

	// Starts the login process
	async startLogin(header: any): Promise<any> {
		const COOKIES = header.cookie ? header.cookie.split("; ") : [];
		const LINK = "https://api.intra.42.fr/oauth/authorize/";
		const REDIRECT_URI = "http%3A%2F%2Flocalhost%3A5173"
		if (COOKIES.length === 0)
			return { redirectUrl: LINK + "?client_id=" + process.env.APP_UID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code"};
		let authCode = COOKIES.find((cookie) => cookie.startsWith('Authorization='))
		if (authCode === undefined)
			return { redirectUrl: LINK + "?client_id=" + process.env.APP_UID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code"};
		authCode = authCode.split('=')[1];
		try {
			const DATA = await this.userRepository.find({ where: {accessToken: CryptoJS.AES.decrypt(authCode, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)} })
			return (DATA.length !== 0) ? { redirectUrl: "http://localhost:5173" } : { redirectUrl: LINK + "?client_id=" + process.env.APP_UID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code"};
		}
		catch {
			return { redirectUrl: LINK + "?client_id=" + process.env.APP_UID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code"};
		}
	}

	// Use the code from query to get token info
	async postCode(code: string): Promise<any> {
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
		if (RETURN_DATA.access_token == null)
			return { accessToken: null };
		let accessToken = CryptoJS.AES.encrypt(RETURN_DATA.access_token, process.env.ENCRYPT_KEY).toString()
		const INTRA_DTO = await this.userService.getMyIntraData(accessToken);
		const ENTITY_USER = await this.userRepository.find({ where: {intraId: INTRA_DTO.id} });
		if (ENTITY_USER.length)
		{
			ENTITY_USER[0].accessToken = RETURN_DATA.access_token;
			this.userRepository.save(ENTITY_USER[0]);
		} else {
			const NEW_USER = new User();
			NEW_USER.intraId = INTRA_DTO.id;
			NEW_USER.elo = 400;
			NEW_USER.accessToken = RETURN_DATA.access_token;
			NEW_USER.avatar = INTRA_DTO.imageSmall;
			NEW_USER.tfaSecret = null;
			this.userRepository.save(NEW_USER);
		}
		return { accessToken };
	}
}