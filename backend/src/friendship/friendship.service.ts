import { Friendship } from 'src/entity/friendship.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FriendshipService {
	constructor(@InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>) {}

	async getFriendshipByID(id: string): Promise<any> {
		return await "hi";
	}

	async newFriendshipByID(senderId: string, receiverId: string, status: string): Promise<any> {
		if (senderId == receiverId)
			return { "error": "Invalid Id - senderId and receiverId are the same" }
		if (isNaN(Number(senderId)) || isNaN(Number(receiverId)) || status == null)
			return { "error": "Missing required property - Ensure you have senderId(number), receiverId(number) and status(string) in your JSON body" }
		if (status.toUpperCase() != "PENDING" && status.toUpperCase() != "ACCEPTED" && status.toUpperCase() != "BLOCKED")
			return { "error": "Invalid status - status must be PENDING, ACCEPTED or BLOCKED"}

		if ((await this.friendshipRepository.find({ where: {senderId: Number(senderId), receiverId: Number(receiverId)} })).length)
			return { "error": "Friendship already exists - use PATCH method to update" }
		
		const NEW_FRIENDSHIP = new Friendship(Number(senderId), Number(receiverId), status.toUpperCase());
		this.friendshipRepository.save(NEW_FRIENDSHIP);
		return NEW_FRIENDSHIP;
	}
}
