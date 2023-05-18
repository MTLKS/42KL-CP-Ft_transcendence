import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/users.entity";
import { Get, Injectable } from "@nestjs/common";
import { GetRedirectDTO, PostCodeResponseDTO } from "src/dto/auth.dto";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";
import * as dotenv from 'dotenv';

@Injectable()
export class AuthService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) { dotenv.config(); }

	// Starts the login process
	async startLogin(accessToken: string): Promise<GetRedirectDTO> {
		try {
			return new GetRedirectDTO(((await this.userRepository.find({ where: {accessToken: CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)} })).length !== 0) ? process.env.CLIENT_DOMAIN + ":" + process.env.FE_PORT : process.env.APP_REDIRECT );
		}
		catch {
			return new GetRedirectDTO(process.env.APP_REDIRECT);
		}
	}

	// Redirects from google auth with user information
	async googleAuthRedirect(req: any): Promise<any> {
		return !req.user ? 'No user from google' : req.user
	}

	// Use the code from query to get token info
	async postCode(code: string): Promise<PostCodeResponseDTO> {
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
			return new PostCodeResponseDTO(null, false);
		let accessToken = CryptoJS.AES.encrypt(RETURN_DATA.access_token, process.env.ENCRYPT_KEY).toString()
		const INTRA_DTO = await this.userService.getMyIntraData(accessToken);
		const ENTITY_USER = await this.userRepository.findOne({ where: {intraId: INTRA_DTO.id} });
		if (ENTITY_USER)
		{
			ENTITY_USER.accessToken = RETURN_DATA.access_token;
			await this.userRepository.save(ENTITY_USER);
		} else {
			await this.userRepository.save(new User(INTRA_DTO.id, INTRA_DTO.name, INTRA_DTO.name, 400, RETURN_DATA.access_token, INTRA_DTO.imageLarge, null));
			return new PostCodeResponseDTO(accessToken, true);
		}
		return new PostCodeResponseDTO(accessToken, false);
	}
}