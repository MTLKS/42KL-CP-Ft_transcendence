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
	async startLogin(accessToken: any): Promise<any> {
		const OAUTH = "https://api.intra.42.fr/oauth/authorize/?client_id=" + process.env.APP_UID + "&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code"
		try {
			return { redirectUrl: ((await this.userRepository.find({ where: {accessToken: CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)} })).length !== 0) ? "http://localhost:5173" : OAUTH };
		}
		catch {
			return { redirectUrl: OAUTH};
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
			return { accessToken: null, newUser: false };
		let accessToken = CryptoJS.AES.encrypt(RETURN_DATA.access_token, process.env.ENCRYPT_KEY).toString()
		const INTRA_DTO = await this.userService.getMyIntraData(accessToken);
		const ENTITY_USER = await this.userRepository.find({ where: {intraId: INTRA_DTO.id} });
		if (ENTITY_USER.length)
		{
			ENTITY_USER[0].accessToken = RETURN_DATA.access_token;
			this.userRepository.save(ENTITY_USER[0]);
		} else {
			const NEW_USER = new User(INTRA_DTO.id, INTRA_DTO.name, INTRA_DTO.name, 400, RETURN_DATA.access_token, INTRA_DTO.imageLarge, null)
			this.userRepository.save(NEW_USER);
			return { accessToken, newUser: true };
		}
		return { accessToken, newUser: false };
	}
}