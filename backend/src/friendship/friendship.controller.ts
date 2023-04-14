import { Get, UseGuards, Param, Post, Body } from '@nestjs/common';
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
	@Post()
	@UseGuards(AuthGuard)
	newFriendshipByID(@Body() body: any): any {
		return this.friendshipService.newFriendshipByID(body.senderId, body.receiverId, body.status);
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
