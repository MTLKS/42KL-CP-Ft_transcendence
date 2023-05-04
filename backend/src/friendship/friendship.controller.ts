import { Get, UseGuards, Param, Post, Body, Patch, Delete, Headers, Controller } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from 'src/guard/AuthGuard';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	// Get all friendship by accessToken
	@Get()
	@UseGuards(AuthGuard)
	getFriendship(@Headers('Authorization') accessToken: string): any {
		return this.friendshipService.getFriendship(accessToken);
	}

	// Get all friendship by intraName
	@Get(":intraName")
	@UseGuards(AuthGuard)
	getFriendshipByID(@Param('intraName') intraName: string): any {
		return this.friendshipService.getFriendshipByIntraNAme(intraName);
	}

	// Create friendship
	@Post()
	@UseGuards(AuthGuard)
	newFriendship(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.friendshipService.newFriendship(accessToken, body.receiverIntraName, body.status);
	}

	// Update friendship by ID
	@Patch()
	@UseGuards(AuthGuard)
	updateFriendship(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.friendshipService.updateFriendship(accessToken, body.receiverIntraName, body.status);
	}
	
	//Delete friendship by ID
	@Delete(":receiverIntraName")
	@UseGuards(AuthGuard)
	deleteFriendship(@Headers('Authorization') accessToken: string, @Param('receiverIntraName') receiverIntraName: string): any {
		return this.friendshipService.deleteFriendship(accessToken, receiverIntraName);
	}
}
