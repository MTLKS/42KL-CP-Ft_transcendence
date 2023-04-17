import { Get, UseGuards, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from 'src/guard/AuthGuard';
import { Controller } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	// Get friendship by ID
	@Get(":id")
	@UseGuards(AuthGuard)
	getFriendshipByID(@Param('id') id: string): any {
		return this.friendshipService.getFriendshipByID(id);
	}

	// Create friendship
	@Post()
	@UseGuards(AuthGuard)
	newFriendship(@Body() body: any): any {
		return this.friendshipService.newFriendship(body.senderId, body.receiverId, body.status);
	}

	// Update friendship by ID
	@Patch()
	@UseGuards(AuthGuard)
	updateFriendship(@Body() body: any): any {
		return this.friendshipService.updateFriendship(body.senderId, body.receiverId, body.status);
	}

	//Delete friendship by ID
	@Delete()
	@UseGuards(AuthGuard)
	deleteFriendship(@Body() body: any): any {
		return this.friendshipService.deleteFriendship(body.senderId, body.receiverId, body.status);
	}

	//Get all friendship by ID

	/**
	 * List of all friends
	 * ID
	 * NAME
	 * ELO
	 * STREAK bool
	 */
}
