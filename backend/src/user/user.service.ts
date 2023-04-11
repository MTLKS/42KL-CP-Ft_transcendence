import { Injectable } from "@nestjs/common";
import { IntraDTO } from "../dto/intra.dto";
import { User } from "../entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	//Use access token to get user info
	async getMyIntraData(accessToken: string) : Promise<any> {
		const HEADER = "Bearer " + accessToken;
		const RESPONSE = await fetch("https://api.intra.42.fr/v2/me", {
			method : "GET",
			headers : { 'Authorization': HEADER }
		});
		if (RESPONSE.status !== 200)
			return RESPONSE
		const USER_DATA = await RESPONSE.json();
		const USER_DTO =  new IntraDTO();
		USER_DTO.id = USER_DATA.id;
		USER_DTO.url = USER_DATA.url;
		USER_DTO.name = USER_DATA.login;
		USER_DTO.email = USER_DATA.email;
		USER_DTO.imageMedium = USER_DATA.image.versions.medium;
		USER_DTO.imageSmall = USER_DATA.image.versions.small;
		USER_DTO.blackhole = USER_DATA.cursus_users[1].blackholed_at;
		return USER_DTO;
	}

	async getMyUserData(accessToken: string) : Promise<any> {
		return await this.userRepository.find({ where: {accessToken} })
	}
}