import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, Res } from "@nestjs/common";
import { User } from "../entity/user.entity";
import { IntraDTO } from "../dto/intra.dto";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";

const PORT = "http://10.15.8.3:3000";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	// Use access token to get user info
	async getMyUserData(accessToken: string) : Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			return { "error": "Invalid access token" }
		}
		const USER_DATA = await this.userRepository.find({ where: {accessToken} });
		if (USER_DATA.length === 0)
			return { "error": "Invalid access token - access token does not exist" }
		USER_DATA[0].accessToken = "hidden";
		return USER_DATA[0];
	}
	
	// Use access token to get intra user info
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
		INTRA_DTO.imageLarge = USER_DATA.image.versions.large;
		INTRA_DTO.blackhole = USER_DATA.cursus_users[1].blackholed_at;
		return INTRA_DTO;
	}

	// Use intraName to get user info
	async getUserDataByIntraName(intraName: string): Promise<any> {
		const USER_DATA = await this.userRepository.find({ where: {intraName} });
		if (USER_DATA.length === 0)
			return USER_DATA[0];
		USER_DATA[0].accessToken = "hidden";
		return USER_DATA[0];
	}

	// Use intraName to get intra user info
	async getIntraDataByIntraName(accessToken: string, intraName: string): Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const HEADER = "Bearer " + accessToken;
		let response = await fetch("https://api.intra.42.fr/v2/users?filter[login]=" + intraName, {
			method : "GET",
			headers : { 'Authorization': HEADER }
		});
		const INTRA_DTO = new IntraDTO();
		let userData = await response.json();
		if (response.status !== 200 || userData.length === 0)
			return INTRA_DTO
		response = await fetch("https://api.intra.42.fr/v2/users/" + userData[0].id, {
				method : "GET",
				headers : { 'Authorization': HEADER }
			});
		userData = await response.json();
		INTRA_DTO.id = userData.id;
		INTRA_DTO.url = userData.url;
		INTRA_DTO.name = userData.login;
		INTRA_DTO.email = userData.email;
		INTRA_DTO.imageMedium = userData.image.versions.medium;
		INTRA_DTO.imageLarge = userData.image.versions.large;
		INTRA_DTO.blackhole = userData.cursus_users[1].blackholed_at;
		return INTRA_DTO;
	}

	// Gets user avatar by intraName
	async getMyAvatar(accessToken: string, res: any): Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const USER_DATA = await this.userRepository.find({ where: {accessToken} });
		return (USER_DATA[0].avatar.startsWith("https://")) ? res.redirect(USER_DATA[0].avatar) : res.sendFile(USER_DATA[0].avatar.substring(USER_DATA[0].avatar.indexOf('avatar/')), { root: '.' });
	}

	// Use intraName to get user avatar
	async getAvatarByIntraName(intraName: string, res: any): Promise<any> {
		const USER_DATA = await this.userRepository.find({ where: {intraName} });
		return (USER_DATA[0].avatar.startsWith("https://")) ? res.redirect(USER_DATA[0].avatar) : res.sendFile(USER_DATA[0].avatar.substring(USER_DATA[0].avatar.indexOf('avatar/')), { root: '.' });
	}

	// Creates new user by saving their userName and avatar
	async newUserInfo(accessToken: string, userName: string, file: any): Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const FS = require('fs');
		const USER_DATA = await this.userRepository.find({ where: {accessToken} });
		if (userName.length > 16)
		{
			if (USER_DATA[0].avatar.includes("avatar/") === true)
				FS.unlink(file.path, () => {});
			return { "error": "Username exceeds 16 characters"}
		}
		console.log(PORT + "/user/" + file.path);
		console.log(USER_DATA[0].avatar);
		if (USER_DATA[0].avatar.includes("avatar/") && (PORT + "/user/" + file.path) !== USER_DATA[0].avatar)
			FS.unlink(USER_DATA[0].avatar.substring(USER_DATA[0].avatar.indexOf('avatar/')), () => {});
		USER_DATA[0].avatar = PORT + "/user/" + file.path;
		USER_DATA[0].userName = userName;
		await this.userRepository.save(USER_DATA[0]);
		USER_DATA[0].accessToken = "hidden";
		return USER_DATA[0];
	}
}