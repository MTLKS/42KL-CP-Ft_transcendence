import { Inject, Injectable } from "@nestjs/common";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
	//Use access token to get user info
	async getUserData(accessToken : string) : Promise<UserDTO>{
		const HEADER = "Bearer " + accessToken;
		const RESPONSE = await fetch ("https://api.intra.42.fr/v2/me", {
			method : "GET",
			headers : {
				'Authorization': HEADER,
			}
		});
		if (RESPONSE.ok){
			const USER_DATA = await RESPONSE.json();
			const USER_DTO =  new UserDTO();
			USER_DTO.intraID = USER_DATA.id;
			USER_DTO.intraName = USER_DATA.login;
			return (USER_DTO);
		}
		else{
			throw new Error('Authentication failed');
		}
	}
}