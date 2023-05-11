import { Friendship } from 'src/entity/friendship.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/users.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FriendshipService {
	constructor(@InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, @InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) {}

	// User connect to friendship socket
	async userConnect(client: any, server: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return { error: USER_DATA.error };
		client.join(USER_DATA.intraName);
	}

	// User send friend request to friendship room
	async friendshipRoom(client: any, server: any, intraName: string): Promise<any> {
		if (intraName === undefined)
			return { error: "Invalid body - body must include intraName(string)" };
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return { error: USER_DATA.error };
		client.join(intraName);
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: intraName} });
		if (FRIENDSHIP === null)
			return { error: "Friendship does not exist" };
		server.to(intraName).emit('friendshipRoom', { "intraName": USER_DATA.intraName, "status": FRIENDSHIP.status });
	}

	// Check if the JSON body is valid
	async checkJson(senderIntraName: string, receiverIntraName: string, status:string): Promise<any> {
		if (receiverIntraName == undefined || status == undefined)
			return { error: "Invalid body - body must include receiverIntraName(string) and status(stirng)" }
		if (senderIntraName == receiverIntraName)
			return { error: "Invalid intraName - no friends so you friend yourself?" }
		if (status.toUpperCase() != "PENDING" && status.toUpperCase() != "ACCEPTED" && status.toUpperCase() != "BLOCKED")
			return { error: "Invalid status - status must be PENDING, ACCEPTED or BLOCKED"}
	}

	// Get all friendship by accessToken
	async getFriendship(accessToken: string): Promise<any> {
		return await this.getFriendshipByIntraNAme((await this.userService.getMyUserData(accessToken)).intraName);
	}

	// Gets all friendship by intraName
	async getFriendshipByIntraNAme(intraName: string): Promise<any> {
		const RECEIVER = await this.friendshipRepository.find({ where: {receiverIntraName: intraName} });
		for (let i = 0; i < RECEIVER.length; i++) {
			const USER = await this.userRepository.findOne({ where: {intraName: RECEIVER[i].senderIntraName} });
			if (USER === null)
				continue;
			RECEIVER[i]['userName'] = USER.userName;
			RECEIVER[i]['elo'] = USER.elo;
			RECEIVER[i]['avatar'] = USER.avatar;
		}
		const SENDER = await this.friendshipRepository.find({ where: {senderIntraName: intraName} });
		for (let i = 0; i < SENDER.length; i++) {
			const USER = await this.userRepository.findOne({ where: {intraName: SENDER[i].receiverIntraName} });
			if (USER === null)
				continue;
			SENDER[i]['userName'] = USER.userName;
			SENDER[i]['elo'] = USER.elo;
			SENDER[i]['avatar'] = USER.avatar;
		}
		return [...RECEIVER, ...SENDER];
	}

	// Creates a new friendship
	async newFriendship(accessToken: string, receiverIntraName: string, status: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		if (USER_DATA.error !== undefined)
			return { error: USER_DATA.error };
		const ERROR = await this.checkJson(USER_DATA.intraName, receiverIntraName, status);
		if (ERROR)
			return ERROR;
		if (status.toUpperCase() == "ACCEPTED")
			return { error: "Friendship status (ACCEPTED) is not supported - use PATCH method to edit an existing PENDING friendship to ACCEPTED friendship instead" }
		if ((await this.friendshipRepository.findOne({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: receiverIntraName} })) !== null || (await this.friendshipRepository.findOne({ where: {senderIntraName: receiverIntraName, receiverIntraName: USER_DATA.intraName} })) !== null)
			return { error: "Friendship already exist - use PATCH method to update or DELETE method to delete this existing entry" }
		const NEW_FRIENDSHIP = new Friendship(USER_DATA.intraName, receiverIntraName, status.toUpperCase(), false);
		await this.friendshipRepository.save(NEW_FRIENDSHIP);
		return NEW_FRIENDSHIP;
	}

	// Updates a friendship
	async updateFriendship(accessToken: string, receiverIntraName: string, status: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		if (USER_DATA.error !== undefined)
			return { error: USER_DATA.error };
		const ERROR = await this.checkJson(USER_DATA.intraName, receiverIntraName, status);
		if (ERROR)
			return ERROR;
		const RECEIVER = await this.friendshipRepository.findOne({ where: {senderIntraName: receiverIntraName, receiverIntraName: USER_DATA.intraName} });
		if (status.toUpperCase() == "ACCEPTED") {
			if (RECEIVER === null)
				return { error: "Friendship does not exist - use POST method to create" }
			RECEIVER.status = status.toUpperCase();
			await this.friendshipRepository.save(RECEIVER);
			return RECEIVER;
		}
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: receiverIntraName} });
		if (status.toUpperCase() == "BLOCKED")
		{
			if (FRIENDSHIP === null && RECEIVER === null)
				return { error: "Friendship does not exist - use POST method to create" }
			if (FRIENDSHIP === null) {
				FRIENDSHIP.status = status.toUpperCase();
				await this.friendshipRepository.save(FRIENDSHIP);
				return FRIENDSHIP;
			} else {
				const NEW_FRIENDSHIP = new Friendship(USER_DATA.intraName, receiverIntraName, status.toUpperCase(), FRIENDSHIP.chatted);
				await this.friendshipRepository.delete(RECEIVER);
				await this.friendshipRepository.save(NEW_FRIENDSHIP);
				return NEW_FRIENDSHIP;
			}
		}
		return { error: "Friendship status (PENDING) is not supported - use POST method to create a new PENDING friendship instead" }
	}

	// Deletes a friendship
	async	deleteFriendship(accessToken: string, receiverIntraName: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		if (USER_DATA.error !== undefined)
			return { error: USER_DATA.error };
		const ERROR = await this.checkJson(USER_DATA.intraName, receiverIntraName, "ACCEPTED");
		if (ERROR)
			return ERROR;
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: [{senderIntraName: USER_DATA.intraName, receiverIntraName: receiverIntraName}, {senderIntraName: receiverIntraName, receiverIntraName: USER_DATA.intraName}] });
		if (FRIENDSHIP === null)
			return { error: "Friendship does not exist - use POST method to create" }
		if (FRIENDSHIP.senderIntraName === USER_DATA.intraName || (FRIENDSHIP.receiverIntraName === USER_DATA.intraName && FRIENDSHIP.status.toUpperCase() !== "BLOCKED"))
			await this.friendshipRepository.delete(FRIENDSHIP);
		return FRIENDSHIP;
	}
}
