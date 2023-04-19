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
	async checkJson(senderId: string, receiverId: string, status:string): Promise<any> {
		if (senderId == receiverId)
			return { "error": "Invalid Id - senderId and receiverId are the same" }
		if (isNaN(Number(senderId)) || isNaN(Number(receiverId)) || status == null)
			return { "error": "Missing required property - Ensure you have senderId(number), receiverId(number) and status(string) in your JSON body" }
		if (status.toUpperCase() != "PENDING" && status.toUpperCase() != "ACCEPTED" && status.toUpperCase() != "BLOCKED")
			return { "error": "Invalid status - status must be PENDING, ACCEPTED or BLOCKED"}
		if ((await this.userRepository.find({ where: {intraId: Number(receiverId)} })).length === 0)
			return { "error": "Invalid Id - receiverId does not exist" }
	}

	// Gets all friendship by ID
	async getFriendshipByID(id: string): Promise<any> {
		if (isNaN(Number(id)))
			return { "error": "Invalid Id - id must be a number" }
		const RECEIVER = await this.friendshipRepository.find({ where: {receiverId: Number(id)} });
		for (let i = 0; i < RECEIVER.length; i++) {
			const USER = await this.userRepository.find({ where: {intraId: Number(RECEIVER[i].senderId)} });
			RECEIVER[i]['intraName'] = USER[0].intraName;
			RECEIVER[i]['userName'] = USER[0].userName;
			RECEIVER[i]['elo'] = USER[0].elo;
			RECEIVER[i]['avatar'] = USER[0].avatar;
		}
		const SENDER = await this.friendshipRepository.find({ where: {senderId: Number(id)} });
		for (let i = 0; i < SENDER.length; i++) {
			const USER = await this.userRepository.find({ where: {intraId: Number(SENDER[i].receiverId)} });
			SENDER[i]['intraName'] = USER[0].intraName;
			SENDER[i]['userName'] = USER[0].userName;
			SENDER[i]['elo'] = USER[0].elo;
			SENDER[i]['avatar'] = USER[0].avatar;
		}
		return [...RECEIVER, ...SENDER];
	}

	// Creates a new friendship
	async newFriendship(accessToken: string, receiverId: string, status: string): Promise<any> {
		let senderId: string;
		try {
			const USER = await this.userService.getMyUserData(accessToken);
			senderId = USER.intraId;
		} catch {
			senderId = null;
		}
		
		const ERROR = await this.checkJson(senderId, receiverId, status);
		if (ERROR)
			return ERROR;
		if (status.toUpperCase() == "ACCEPTED")
			return { "error": "Friendship status (ACCEPTED) is not supported - use PATCH method to edit an existing PENDING friendship to ACCEPTED friendship instead" }
		if ((await this.friendshipRepository.find({ where: {senderId: Number(senderId), receiverId: Number(receiverId)} })).length || (await this.friendshipRepository.find({ where: {senderId: Number(receiverId), receiverId: Number(senderId)} })).length)
			return { "error": "Friendship already exist - use PATCH method to update or DELETE method to delete this existing entry" }
		
		const NEW_FRIENDSHIP = new Friendship(Number(senderId), Number(receiverId), status.toUpperCase());
		this.friendshipRepository.save(NEW_FRIENDSHIP);
		return NEW_FRIENDSHIP;
	}

	// Updates a friendship
	async updateFriendship(accessToken: string, receiverId: string, status: string): Promise<any> {
		try {
			const USER = await this.userService.getMyUserData(accessToken);
			var senderId = USER.intraId;
		} catch {
			var senderId = null;
		}

		const ERROR = await this.checkJson(senderId, receiverId, status);
		if (ERROR)
			return ERROR;

		const RECEIVER = await this.friendshipRepository.find({ where: {senderId: Number(receiverId), receiverId: Number(senderId)} });
		if (status.toUpperCase() == "ACCEPTED") {
			if (RECEIVER.length === 0)
				return { "error": "Friendship does not exist - use POST method to create" }
			RECEIVER[0].status = status.toUpperCase();
			this.friendshipRepository.save(RECEIVER[0]);
			return RECEIVER[0];
		}
		const FRIENDSHIP = await this.friendshipRepository.find({ where: {senderId: Number(senderId), receiverId: Number(receiverId)} });
		if (status.toUpperCase() == "BLOCKED")
		{
			if (FRIENDSHIP.length === 0 && RECEIVER.length === 0)
				return { "error": "Friendship does not exist - use POST method to create" }
			if (FRIENDSHIP.length !== 0) {
				FRIENDSHIP[0].status = status.toUpperCase();
				this.friendshipRepository.save(FRIENDSHIP[0]);
				return FRIENDSHIP[0];
			} else {
				const NEW_FRIENDSHIP = new Friendship(Number(senderId), Number(receiverId), status.toUpperCase());
				this.friendshipRepository.delete(RECEIVER[0]);
				this.friendshipRepository.save(NEW_FRIENDSHIP);
				return NEW_FRIENDSHIP;
			}
		}
		return { "error": "Friendship status (PENDING) is not supported - use POST method to create a new PENDING friendship instead" }
	}

	// Deletes a friendship
	async	deleteFriendship(accessToken: string, receiverId: string, status: string): Promise<any> {
		try {
			const USER = await this.userService.getMyUserData(accessToken);
			var senderId = USER.intraId;
		} catch {
			var senderId = null;
		}

		const ERROR = await this.checkJson(senderId, receiverId, status);
		if (ERROR)
			return ERROR;

		const SENDER = await this.friendshipRepository.find({ where: {senderId: Number(senderId), receiverId: Number(receiverId), status: status.toUpperCase()} });
		if (SENDER.length === 0)
			return { "error": "Friendship does not exist - use POST method to create" }
		this.friendshipRepository.delete(SENDER[0]);
		return SENDER[0];
	}
}
