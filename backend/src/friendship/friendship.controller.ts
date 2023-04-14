import { Get, UseGuards, Param, Post } from '@nestjs/common';
import { AuthGuard } from 'src/guard/AuthGuard';
import { Controller } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	@Get(":id")
	@UseGuards(AuthGuard)
	getFriendshipByID(@Param('id') id: string): any {
		return this.friendshipService.getFriendshipByID(id);
	}

	//New friendship by ID
	@Post("new/:sid/:rid")
	@UseGuards(AuthGuard)
	newFriendshipByID(@Param('sid') sid: string, @Param('rid') rid: string): any {
		return this.friendshipService.newFriendshipByID(sid, rid);
	}

	//Delete friendship by ID

	//Get all friendship by ID

	/**
	 * List of all friends
	 * ID
	 * NAME
	 * ELO
	 * STREAK bool
	 */
}
