import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Injectable } from "@nestjs/common";
import { IntraDTO } from "../dto/intra.dto";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	//Use access token to get user info
	async getMyIntraData(accessToken: string) : Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const HEADER = "Bearer " + accessToken;
		const RESPONSE = await fetch("https://api.intra.42.fr/v2/me", {
			method : "GET",
			headers : { 'Authorization': HEADER }
		});
		const INTRA_DTO = new IntraDTO();
		if (RESPONSE.status !== 200)
			return INTRA_DTO
		const USER_DATA = await RESPONSE.json();
		INTRA_DTO.id = USER_DATA.id;
		INTRA_DTO.url = USER_DATA.url;
		INTRA_DTO.name = USER_DATA.login;
		INTRA_DTO.email = USER_DATA.email;
		INTRA_DTO.imageMedium = USER_DATA.image.versions.medium;
		INTRA_DTO.imageSmall = USER_DATA.image.versions.small;
		INTRA_DTO.blackhole = USER_DATA.cursus_users[1].blackholed_at;
		return INTRA_DTO;
	}

	async getMyUserData(accessToken: string) : Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		return await this.userRepository.find({ where: {accessToken} })
	}
}