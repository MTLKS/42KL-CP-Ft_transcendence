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

	async newFriendshipByID(sid: string, rid: string): Promise<any> {
		const NEW_FRIENDSHIP = new Friendship();
		NEW_FRIENDSHIP.senderId = Number(sid);
		NEW_FRIENDSHIP.receiverId = Number(rid);
		
		return await "new";

	}
}
