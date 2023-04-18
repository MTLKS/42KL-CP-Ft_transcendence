import { Friendship } from 'src/entity/friendship.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FriendshipService {
	constructor(@InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, private userService: UserService) {}

	// Check if the JSON body is valid
	checkJson(senderId: string, receiverId: string, status:string): any {
		if (senderId == receiverId)
			return { "error": "Invalid Id - senderId and receiverId are the same" }
		if (isNaN(Number(senderId)) || isNaN(Number(receiverId)) || status == null)
			return { "error": "Missing required property - Ensure you have senderId(number), receiverId(number) and status(string) in your JSON body" }
		if (status.toUpperCase() != "PENDING" && status.toUpperCase() != "ACCEPTED" && status.toUpperCase() != "BLOCKED")
			return { "error": "Invalid status - status must be PENDING, ACCEPTED or BLOCKED"}
	}

	// Gets all friendship by ID
	async getFriendshipByID(id: string): Promise<any> {
		if (isNaN(Number(id)))
			return { "error": "Invalid Id - id must be a number" }
		const RECEIVER = await this.friendshipRepository.find({ where: {receiverId: Number(id)} });
		const SENDER = await this.friendshipRepository.find({ where: {senderId: Number(id)} });
		return [...RECEIVER, ...SENDER];
	}

	// Creates a new friendship
	async newFriendship(accessToken: string, receiverId: string, status: string): Promise<any> {
		try {
			const USER = await this.userService.getMyUserData(accessToken);
			var senderId = USER.intraId;
		} catch {
			var senderId = null;
		}
		
		const ERROR = this.checkJson(senderId, receiverId, status);
		if (ERROR)
			return ERROR;

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

		const ERROR = this.checkJson(senderId, receiverId, status);
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
		return { "error": "Friendship status (PENDING) is not supported - use POST method to create a new friendship instead" }
	}

	// Deletes a friendship
	async	deleteFriendship(accessToken: string, receiverId: string, status: string): Promise<any> {
		try {
			const USER = await this.userService.getMyUserData(accessToken);
			var senderId = USER.intraId;
		} catch {
			var senderId = null;
		}

		const ERROR = this.checkJson(senderId, receiverId, status);
		if (ERROR)
			return ERROR;

		const SENDER = await this.friendshipRepository.find({ where: {senderId: Number(senderId), receiverId: Number(receiverId), status: status.toUpperCase()} });
		if (SENDER.length === 0)
			return { "error": "Friendship does not exist - use POST method to create" }
		this.friendshipRepository.delete(SENDER[0]);
		return SENDER[0];
	}
}
