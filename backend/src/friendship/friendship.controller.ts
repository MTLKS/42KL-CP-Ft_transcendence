import { Get, UseGuards, Param, Post, Body, Patch, Delete, Headers, Controller } from '@nestjs/common';
import { ApiCommonHeader } from 'src/ApiCommonHeader/ApiCommonHeader.decorator';
import { FriendshipDTO, PostFriendshipBodyDTO } from 'src/dto/friendship.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from 'src/guard/AuthGuard';

@ApiTags('Friendship')
@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	// Get all friendship by accessToken
	@Get()
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid friendship - you are blocked by this user"])
	@ApiOkResponse({ description: "Returns all the user's friendships", type: [FriendshipDTO]})
	getFriendship(@Headers('Authorization') accessToken: string): Promise<any> {
		return this.friendshipService.getFriendship(accessToken);
	}

	// Get all friendship by userName
	@Get(":userName")
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid friendship - you are blocked by this user"])
	@ApiOkResponse({ description: "Returns all the user's friendships", type: [FriendshipDTO]})
	getFriendshipByUserName(@Headers('Authorization') accessToken: string, @Param('userName') userName: string): Promise<any> {
		return this.friendshipService.getFriendshipByUserName(accessToken, userName);
	}

	// Create friendship
	@Post()
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid body - body must include receiverUserName(string) and status(string)", "Invalid userName - no friends so you friend yourself?", "Invalid status - status must be PENDING, ACCEPTED or BLOCKED", "Invalid status - friendship status (ACCEPTED) is not supported", "Invalid receiverUserName - friendship already exist", "Invalid receiverUserName - user does not exist"], )
	@ApiCreatedResponse({ description: "Creates a new friendship. ACCEPTED status is not allowed", type: FriendshipDTO})
	newFriendship(@Headers('Authorization') accessToken: string, @Body() body: PostFriendshipBodyDTO): Promise<any> {
		return this.friendshipService.newFriendship(accessToken, body.receiverUserName, body.status);
	}

	// Update friendship by ID
	@Patch()
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid body - body must include receiverUserName(string) and status(string)", "Invalid userName - no friends so you friend yourself?", "Invalid status - status must be PENDING, ACCEPTED or BLOCKED", "Invalid receiverUserName - friendship does not exist", "Invalid receiverUserName - friendship already exist"])
	@ApiOkResponse({ description: "Updates a friendship, PENDING status is not allowed, ACCEPTED status can only be used on a PENDING status", type: FriendshipDTO})
	updateFriendship(@Headers('Authorization') accessToken: string, @Body() body: PostFriendshipBodyDTO): Promise<any> {
		return this.friendshipService.updateFriendship(accessToken, body.receiverUserName, body.status);
	}
	
	//Delete friendship by ID
	@Delete(":receiverUserName")
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid friendship - friendship does not exist", "Invalid receiverUserName - you really thought you can unblock yourself like this?"])
	@ApiOkResponse({ description: "Deletes a friendship", type: FriendshipDTO})
	deleteFriendship(@Headers('Authorization') accessToken: string, @Param('receiverUserName') receiverUserName: string): Promise<any> {
		return this.friendshipService.deleteFriendship(accessToken, receiverUserName);
	}
}
