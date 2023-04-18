import { Get, UseGuards, Param, Post, Body, Patch, Delete, Headers } from '@nestjs/common';
import { AuthGuard } from 'src/guard/AuthGuard';
import { Controller } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	// Get all friendship by ID
	@Get(":id")
	@UseGuards(AuthGuard)
	getFriendshipByID(@Param('id') id: string): any {
		return this.friendshipService.getFriendshipByID(id);
	}

	// Create friendship
	@Post()
	@UseGuards(AuthGuard)
	newFriendship(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.friendshipService.newFriendship(accessToken, body.receiverId, body.status);
	}

	// Update friendship by ID
	@Patch()
	@UseGuards(AuthGuard)
	updateFriendship(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.friendshipService.updateFriendship(accessToken, body.receiverId, body.status);
	}

	//Delete friendship by ID
	@Delete()
	@UseGuards(AuthGuard)
	deleteFriendship(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.friendshipService.deleteFriendship(accessToken, body.receiverId, body.status);
	}

	/**
	 * List of all friends
	 * ID
	 * INTRANAME
	 * USERNAME
	 * ELO
	 * avatar
	 */
}
