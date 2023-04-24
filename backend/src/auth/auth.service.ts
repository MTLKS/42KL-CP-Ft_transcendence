import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Injectable } from "@nestjs/common";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";
import * as dotenv from 'dotenv';

@Injectable()
export class AuthService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) { dotenv.config(); }

	// Starts the login process
	async startLogin(accessToken: any): Promise<any> {
		try {
			return { redirectUrl: ((await this.userRepository.find({ where: {accessToken: CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)} })).length !== 0) ? process.env.CLIENT_DOMAIN + ":" + process.env.FE_PORT : process.env.APP_REDIRECT };
		}
		catch {
			return { redirectUrl: process.env.APP_REDIRECT};
		}
	}

	// Use the code from query to get token info
	async postCode(code: string): Promise<any> {
		const DATA = {
			"grant_type": "authorization_code",
			"client_id": process.env.APP_UID,
			"client_secret": process.env.APP_SECRET,
			"code": code,
			"redirect_uri": process.env.CLIENT_DOMAIN + ':' + process.env.FE_PORT
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
			this.userRepository.save(new User(INTRA_DTO.id, INTRA_DTO.name, INTRA_DTO.name, 400, RETURN_DATA.access_token, INTRA_DTO.imageLarge, null));
			return { accessToken, newUser: true };
		}
		return { accessToken, newUser: false };
	}
}