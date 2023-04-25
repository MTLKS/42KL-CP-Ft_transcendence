import { Friendship } from 'src/entity/friendship.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FriendshipService {
	constructor(@InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, @InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) {}

	// Check if the JSON body is valid
	async checkJson(senderIntraName: string, receiverIntraName: string, status:string): Promise<any> {
		if (receiverIntraName == undefined || status == undefined)
			return { "error": "Invalid body - body must include receiverIntraName(string) and status(stirng)" }
		if (senderIntraName == receiverIntraName)
			return { "error": "Invalid intraName - no friends so you friend yourself" }
		if (status.toUpperCase() != "PENDING" && status.toUpperCase() != "ACCEPTED" && status.toUpperCase() != "BLOCKED")
			return { "error": "Invalid status - status must be PENDING, ACCEPTED or BLOCKED"}
		if ((await this.userRepository.find({ where: {intraName: receiverIntraName} })).length === 0)
			return { "error": "Invalid intraName - receiverIntraName does not exist" }
	}

	// Get all friendship by accessToken
	async getFriendship(accessToken: string): Promise<any> {
		return await this.getFriendshipByIntraNAme((await this.userService.getMyUserData(accessToken)).intraName);
	}

	// Gets all friendship by intraName
	async getFriendshipByIntraNAme(intraName: string): Promise<any> {
		const RECEIVER = await this.friendshipRepository.find({ where: {receiverIntraName: intraName} });
		for (let i = 0; i < RECEIVER.length; i++) {
			const USER = await this.userRepository.find({ where: {intraName: RECEIVER[i].senderIntraName} });
			RECEIVER[i]['userName'] = USER[0].userName;
			RECEIVER[i]['elo'] = USER[0].elo;
			RECEIVER[i]['avatar'] = USER[0].avatar;
		}
		const SENDER = await this.friendshipRepository.find({ where: {senderIntraName: intraName} });
		for (let i = 0; i < SENDER.length; i++) {
			const USER = await this.userRepository.find({ where: {intraName: SENDER[i].receiverIntraName} });
			SENDER[i]['userName'] = USER[0].userName;
			SENDER[i]['elo'] = USER[0].elo;
			SENDER[i]['avatar'] = USER[0].avatar;
		}
		return [...RECEIVER, ...SENDER];
	}

	// Creates a new friendship
	async newFriendship(accessToken: string, receiverIntraName: string, status: string): Promise<any> {
		let senderIntraName: string;
		try {
			senderIntraName = (await this.userService.getMyUserData(accessToken)).intraName;
		} catch {
			senderIntraName = null;
		}
		
		const ERROR = await this.checkJson(senderIntraName, receiverIntraName, status);
		if (ERROR)
			return ERROR;
		if (status.toUpperCase() == "ACCEPTED")
			return { "error": "Friendship status (ACCEPTED) is not supported - use PATCH method to edit an existing PENDING friendship to ACCEPTED friendship instead" }
		if ((await this.friendshipRepository.find({ where: {senderIntraName: senderIntraName, receiverIntraName: receiverIntraName} })).length || (await this.friendshipRepository.find({ where: {senderIntraName: receiverIntraName, receiverIntraName: senderIntraName} })).length)
			return { "error": "Friendship already exist - use PATCH method to update or DELETE method to delete this existing entry" }
		
		const NEW_FRIENDSHIP = new Friendship(senderIntraName, receiverIntraName, status.toUpperCase());
		await this.friendshipRepository.save(NEW_FRIENDSHIP);
		return NEW_FRIENDSHIP;
	}

	// Updates a friendship
	async updateFriendship(accessToken: string, receiverIntraName: string, status: string): Promise<any> {
		try {
			const USER = await this.userService.getMyUserData(accessToken);
			var senderIntraName = USER.intraName;
		} catch {
			var senderIntraName = undefined;
		}

		const ERROR = await this.checkJson(senderIntraName, receiverIntraName, status);
		if (ERROR)
			return ERROR;

		const RECEIVER = await this.friendshipRepository.find({ where: {senderIntraName: receiverIntraName, receiverIntraName: senderIntraName} });
		if (status.toUpperCase() == "ACCEPTED") {
			if (RECEIVER.length === 0)
				return { "error": "Friendship does not exist - use POST method to create" }
			RECEIVER[0].status = status.toUpperCase();
			await this.friendshipRepository.save(RECEIVER[0]);
			return RECEIVER[0];
		}
		const FRIENDSHIP = await this.friendshipRepository.find({ where: {senderIntraName: senderIntraName, receiverIntraName: receiverIntraName} });
		if (status.toUpperCase() == "BLOCKED")
		{
			if (FRIENDSHIP.length === 0 && RECEIVER.length === 0)
				return { "error": "Friendship does not exist - use POST method to create" }
			if (FRIENDSHIP.length !== 0) {
				FRIENDSHIP[0].status = status.toUpperCase();
				await this.friendshipRepository.save(FRIENDSHIP[0]);
				return FRIENDSHIP[0];
			} else {
				const NEW_FRIENDSHIP = new Friendship(senderIntraName, receiverIntraName, status.toUpperCase());
				await this.friendshipRepository.delete(RECEIVER[0]);
				await this.friendshipRepository.save(NEW_FRIENDSHIP);
				return NEW_FRIENDSHIP;
			}
		}
		return { "error": "Friendship status (PENDING) is not supported - use POST method to create a new PENDING friendship instead" }
	}

	// Deletes a friendship
	async	deleteFriendship(accessToken: string, receiverIntraName: string, status: string): Promise<any> {
		try {
			const USER = await this.userService.getMyUserData(accessToken);
			var senderIntraName = USER.intraName;
		} catch {
			var senderIntraName = null;
		}

		const ERROR = await this.checkJson(senderIntraName, receiverIntraName, status);
		if (ERROR)
			return ERROR;

		const SENDER = await this.friendshipRepository.find({ where: {senderIntraName: senderIntraName, receiverIntraName: receiverIntraName, status: status.toUpperCase()} });
		if (SENDER.length === 0)
			return { "error": "Friendship does not exist - use POST method to create" }
		this.friendshipRepository.delete(SENDER[0]);
		return SENDER[0];
	}
}
