import { Injectable } from "@nestjs/common";
import { UserDTO } from "../dto/user.dto";

@Injectable()
export class UserService {
	//Use access token to get user info
	async getMyData(accessToken: string) : Promise<any>{
		const HEADER = "Bearer " + accessToken;
		const RESPONSE = await fetch("https://api.intra.42.fr/v2/me", {
			method : "GET",
			headers : { 'Authorization': HEADER }
		});
		if (RESPONSE.status !== 200)
			return RESPONSE
		const USER_DATA = await RESPONSE.json();
		const USER_DTO =  new UserDTO();
		USER_DTO.intraId = USER_DATA.id;
		USER_DTO.intraUrl = USER_DATA.url;
		USER_DTO.intraName = USER_DATA.login;
		USER_DTO.intraEmail = USER_DATA.email;
		USER_DTO.intraImageMedium = USER_DATA.image.versions.medium;
		USER_DTO.intraImageSmall = USER_DATA.image.versions.small;
		USER_DTO.intraBlackhole = USER_DATA.cursus_users[1].blackholed_at;
		return USER_DTO;
	}
}