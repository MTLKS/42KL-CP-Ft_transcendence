import { Friendship } from "src/entity/friendship.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/users.entity";
import { Injectable } from "@nestjs/common";
import { IntraDTO } from "../dto/intra.dto";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>) {}

	// Use access token to get user info
	async getMyUserData(accessToken: string) : Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			return { error: "Invalid access token - access token is invalid" };
		}
		const USER_DATA = await this.userRepository.findOne({ where: {accessToken} });
		if (USER_DATA === null)
			return { error: "Invalid access token - access token does not exist" };
		USER_DATA.accessToken = "hidden";
		USER_DATA.tfaSecret = USER_DATA.tfaSecret === null ? "DISABLED" : "ENABLED";
		return USER_DATA;
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
			return { error: (await RESPONSE.json()).error };
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
	async getUserDataByIntraName(accessToken: string, intraName: string): Promise<any> {
		if (intraName === undefined)
			return { error: "Invalid body - body must include intraName(string)" };
		const USER_DATA = await this.getMyUserData(accessToken);
		const FRIEND_DATA = await this.userRepository.findOne({ where: {intraName} });
		if (FRIEND_DATA === null)
			return { error: "Invalid intraName - intraName does not exist" };
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: [{senderIntraName: USER_DATA.intraName, receiverIntraName: FRIEND_DATA.intraName}, {senderIntraName: FRIEND_DATA.intraName, receiverIntraName: USER_DATA.intraName}] });
		if (FRIENDSHIP !== null && FRIENDSHIP.status === "BLOCKED")
			return { error: "Invalid friendship - You are blocked by this user" };
		FRIEND_DATA.accessToken = "hidden";
		FRIEND_DATA.tfaSecret = "hidden";
		return FRIEND_DATA;
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
			return { error: userData.error };
		if (response.status !== 200 || userData.length === 0)
			return { error: userData.error };
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
		const USER_DATA = await this.userRepository.findOne({ where: {accessToken} });
		return USER_DATA.avatar.startsWith("https://") ? res.redirect(USER_DATA.avatar) : res.sendFile(USER_DATA.avatar.substring(USER_DATA.avatar.indexOf('avatar/')), { root: '.' });
	}

	// Use intraName to get user avatar
	async getAvatarByIntraName(intraName: string, res: any): Promise<any> {
		const USER_DATA = await this.userRepository.findOne({ where: {intraName} });
		return USER_DATA === null ? { error: "Invalid intraName - user does not exist" } : USER_DATA.avatar.startsWith("https://") ? res.redirect(USER_DATA.avatar) : res.sendFile(USER_DATA.avatar.substring(USER_DATA.avatar.indexOf('avatar/')), { root: '.' });
	}

	// Updates existing user by saving their userName and avatar
	async updateUserInfo(accessToken: string, userName: string, image: any): Promise<any> {
		if (image === undefined)
			return { error: "Invalid image path - no avatar image given" }
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
		} catch {
			accessToken = null;
		}
		const NEW_USER = await this.userRepository.findOne({ where: {accessToken} });
		const EXISTING = await this.userRepository.findOne({ where: {userName} });
		if (EXISTING !== null && accessToken !== EXISTING.accessToken)
			return { error: "Invalid username - username already exists or invalid" };
		if (userName.length > 16 || userName.length < 1 || /^[a-zA-Z0-9_-]+$/.test(userName) === false)
			return { error: "Invalid username - username must be 1-16 alphanumeric characters (Including '-' and '_') only" };
		fs.rename(image.path, "avatar/" + NEW_USER.intraName, () => {});
		image.path = "avatar/" + NEW_USER.intraName;
		NEW_USER.avatar = process.env.DOMAIN + ":" + process.env.BE_PORT + "/user/" + image.path;
		NEW_USER.userName = userName;
		fs.writeFile(image.path, await sharp(image.path).resize({ width: 500, height: 500}).toBuffer(), () => {});
		await this.userRepository.save(NEW_USER);
		NEW_USER.accessToken = "hidden";
		NEW_USER.tfaSecret = "hidden";
		return NEW_USER;
	}

	// Hides sensitive data
	hideData(body: any): any {
		const hideUser = (user: any) => ({
			...user,
			accessToken: "hidden",
			tfaSecret: "hidden",
		});
	
		if (Array.isArray(body)) {
			if (body[0].owner !== undefined)
				return body.map((item) => ({
					...item,
					owner: hideUser(item.owner),
				}));
			else if (body[0].user !== undefined)
				return body.map((item) => ({
					...item,
					user: hideUser(item.user),
				}));
		} else {
			if (body.owner !== undefined)
				return {
					...body,
					user: hideUser(body.owner),
				};
			else if (body.user !== undefined)
				return {
					...body,
					user: hideUser(body.user),
				};
		}
	}
}