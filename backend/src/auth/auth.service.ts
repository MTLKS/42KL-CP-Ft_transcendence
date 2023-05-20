import { GetRedirectDTO, AuthResponseDTO } from "src/dto/auth.dto";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/users.entity";
import { Injectable } from "@nestjs/common";
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
	async googleAuthRedirect(req: any): Promise<AuthResponseDTO> {
		let accessToken = CryptoJS.AES.encrypt(req.user.accessToken, process.env.ENCRYPT_KEY).toString()

		const ENTITY_USER = await this.userRepository.findOne({ where: { email: req.user.email } });
		if (ENTITY_USER !== null) {
			ENTITY_USER.accessToken = accessToken;
			await this.userRepository.save(ENTITY_USER);
			return new AuthResponseDTO(accessToken, false);
		}

		const QUERY = this.userRepository.createQueryBuilder("user");
		QUERY.select("MIN(user.intraId)", "intraId");
		const LAST_USER = await QUERY.getRawOne();
		const ID = Math.min(LAST_USER.intraId, 0) - 1;
		let intraName = '@' + req.user.email.substring(0, 5);
		if (req.user.email.split('@')[0].length < 5)
			intraName = '@' + req.user.email;
		for (let i = 5; i <= req.user.email.length && i < 8; i++) {
			intraName = '@' + req.user.email.substring(0, i);
			if (await this.userRepository.findOne({ where: { intraName: intraName } }) === null) {
				await this.userRepository.save(new User(ID, intraName, intraName, req.user.email, 400, accessToken, req.user.picture, null, true));
				return new AuthResponseDTO(accessToken, true);
			}
		}
		for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
			const TEST = intraName + i.toString();
			if (await this.userRepository.findOne({ where: { intraName: TEST } }) === null) {
				await this.userRepository.save(new User(ID, TEST, TEST, req.user.email, 400, accessToken, req.user.picture, null, true));
				return new AuthResponseDTO(accessToken, true);
			}
		}
	}

	// Use the code from query to get token info
	async postCode(code: string): Promise<AuthResponseDTO> {
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
			return new AuthResponseDTO(null, false);
		let accessToken = CryptoJS.AES.encrypt(RETURN_DATA.access_token, process.env.ENCRYPT_KEY).toString()
		const INTRA_DTO = await this.userService.getMyIntraData(accessToken);
		const ENTITY_USER = await this.userRepository.findOne({ where: {intraId: INTRA_DTO.id} });
		if (ENTITY_USER) {
			ENTITY_USER.accessToken = RETURN_DATA.access_token;
			await this.userRepository.save(ENTITY_USER);
		} else {
			await this.userRepository.save(new User(INTRA_DTO.id, INTRA_DTO.name, INTRA_DTO.name, INTRA_DTO.email, 400, RETURN_DATA.access_token, INTRA_DTO.imageLarge, null, true));
			return new AuthResponseDTO(accessToken, true);
		}
		return new AuthResponseDTO(accessToken, false);
	}
}