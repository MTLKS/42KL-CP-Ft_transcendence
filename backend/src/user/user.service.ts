import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "../entity/user.entity";
import { IntraDTO } from "../dto/intra.dto";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	// Use access token to get user info
	async getMyUserData(accessToken: string) : Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			return { "error": "Invalid access token - access token is invalid" };
		}
		const USER_DATA = await this.userRepository.find({ where: {accessToken} });
		if (USER_DATA.length === 0)
			return { "error": "Invalid access token - access token does not exist" };
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
		if (RESPONSE.status !== 200)
			return { "error": (await RESPONSE.json()).error };
		const USER_DATA = await RESPONSE.json();
		return new IntraDTO({
			id: USER_DATA.id,
			url: USER_DATA.url,
			name: USER_DATA.login,
			email: USER_DATA.email,
			imageMedium: USER_DATA.image.versions.medium,
			imageLarge: USER_DATA.image.versions.large,
			blackhole: USER_DATA.cursus_users[1].blackholed_at
		});
	}

	// Use intraName to get user info
	async getUserDataByIntraName(intraName: string): Promise<any> {
		if (intraName === undefined)
			return;
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
		let userData = await response.json();
		if (userData.error !== undefined)
			return { "error": userData.error };
		if (response.status !== 200 || userData.length === 0)
			return { "error": userData.error };
		response = await fetch("https://api.intra.42.fr/v2/users/" + userData[0].id, {
			method : "GET",
			headers : { 'Authorization': HEADER }
		});
		userData = await response.json();
		return new IntraDTO({
			id: userData.id,
			url: userData.url,
			name: userData.login,
			email: userData.email,
			imageMedium: userData.image.versions.medium,
			imageLarge: userData.image.versions.large,
			blackhole: userData.cursus_users[1].blackholed_at
		});;
	}

	// Gets user avatar by intraName
	async getMyAvatar(accessToken: string, res: any): Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const USER_DATA = await this.userRepository.find({ where: {accessToken} });
		return USER_DATA[0].avatar.startsWith("https://") ? res.redirect(USER_DATA[0].avatar) : res.sendFile(USER_DATA[0].avatar.substring(USER_DATA[0].avatar.indexOf('avatar/')), { root: '.' });
	}

	// Use intraName to get user avatar
	async getAvatarByIntraName(intraName: string, res: any): Promise<any> {
		const USER_DATA = await this.userRepository.find({ where: {intraName} });
		if (USER_DATA.length === 0)
			return { "error": "Invalid intraName - user does not exist" };
		return USER_DATA[0].avatar.startsWith("https://") ? res.redirect(USER_DATA[0].avatar) : res.sendFile(USER_DATA[0].avatar.substring(USER_DATA[0].avatar.indexOf('avatar/')), { root: '.' });
	}

	// Creates new user by saving their userName and avatar
	async newUserInfo(accessToken: string, userName: string, file: any): Promise<any> {
		const ERROR_DELETE = (errMsg: string) => {
			if (FS.existsSync(file.path) && (process.env.DOMAIN + ':' + process.env.BE_PORT + '/user/' + file.path) !== NEW_USER[0].avatar)
				FS.unlink(file.path, () => {});
			return { "error": errMsg }
		}
		if (file === undefined)
			return { "error": "Invalid file path - no avatar image given" }
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const FS = require('fs');
		const NEW_USER = await this.userRepository.find({ where: {accessToken} });
		if (NEW_USER.length !== 0)
			return { "erroro": "Invalid accessToken - user information already exists, use PATCH to update instead" };
		const EXISTING = await this.userRepository.find({ where: {userName} });
		if (EXISTING.length !== 0 && accessToken !== EXISTING[0].accessToken)
			return ERROR_DELETE("Invalid username - username already exists or invalid");
		if (userName.length > 16 || userName.length < 1)
			return ERROR_DELETE("Invalid username - username must be 1-16 characters only");
		NEW_USER[0].avatar = process.env.DOMAIN + ":" + process.env.BE_PORT + "/user/" + file.path;
		NEW_USER[0].userName = userName;
		await this.userRepository.save(NEW_USER[0]);
		NEW_USER[0].accessToken = "hidden";
		return NEW_USER[0];
	}

	// Updates existing user by saving their userName and avatar
	async updateUserInfo(accessToken: string, userName: string, file: any): Promise<any> {
		const ERROR_DELETE = (errMsg: string) => {
			if (FS.existsSync(file.path) && (process.env.DOMAIN + ':' + process.env.BE_PORT + '/user/' + file.path) !== NEW_USER[0].avatar)
				FS.unlink(file.path, () => {});
			return { "error": errMsg }
		}
		if (file === undefined)
			return { "error": "Invalid file path - no avatar image given" }
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const FS = require('fs');
		const NEW_USER = await this.userRepository.find({ where: {accessToken} });
		const EXISTING = await this.userRepository.find({ where: {userName} });
		if (EXISTING.length !== 0 && accessToken !== EXISTING[0].accessToken)
			return ERROR_DELETE("Invalid username - username already exists or invalid");
		if (userName.length > 16 || userName.length < 1)
			return ERROR_DELETE("Invalid username - username must be 1-16 characters only");
		if (NEW_USER[0].avatar.includes("avatar/") && (process.env.DOMAIN + ":" + process.env.PORT + "/user/" + file.path) !== NEW_USER[0].avatar)
			FS.unlink(NEW_USER[0].avatar.substring(NEW_USER[0].avatar.indexOf('avatar/')), () => {});
		NEW_USER[0].avatar = process.env.DOMAIN + ":" + process.env.BE_PORT + "/user/" + file.path;
		NEW_USER[0].userName = userName;
		await this.userRepository.save(NEW_USER[0]);
		NEW_USER[0].accessToken = "hidden";
		return NEW_USER[0];
	}
}