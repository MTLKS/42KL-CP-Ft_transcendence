import { ChannelDTO, DeleteRoomMemberBodyDTO, GetMessageBodyDTO, MemberDTO, MessageDTO, PatchRoomBodyDTO, PatchRoomMemberBodyDTO, PostRoomBodyDTO, PostRoomMemberBodyDTO } from "src/dto/chat.dto";
import { Body, Controller, Get, Headers, Param, Post, Patch, Query, Delete } from "@nestjs/common";
import { ApiCommonHeader } from "src/ApiCommonHeader/ApiCommonHeader.decorator";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guard/AuthGuard";
import { ChatService } from "./chat.service";
import { UseGuards } from "@nestjs/common";

@ApiTags("Chat")
@Controller("chat")
export class ChatController {
	constructor (private readonly chatService: ChatService) {}
	
	@Get('member/:channelID')
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid channelId - member is not found in that channelId"])
	@ApiOkResponse({ description: "Returns the member data of the user in the channel", type: MemberDTO})
	getMyMemberData(@Headers('Authorization') accessToken: string, @Param('channelID') channelId: number): Promise<any> {
		return this.chatService.getMyMemberData(accessToken, channelId);
	}

	@Get('channel')
	@UseGuards(AuthGuard)
	@ApiCommonHeader()
	@ApiOkResponse({ description: "Returns all the DM channels of the user", type: [ChannelDTO]})
	getAllChannel(@Headers('Authorization') accessToken: string): Promise<[ChannelDTO]> {
		return this.chatService.getAllChannel(accessToken);
	}

	@Get('message/:channelID')
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid body - body must include channelId(number)", "Invalid channelId - channel is not found", "Invalid channelId - you are not friends with this user"])
	@ApiOkResponse({ description: "Returns all the messages of the user in the channel", type: [MessageDTO]})
	getAllMessageFromChannel(@Headers('Authorization') accessToken: string, @Param('channelID') channelId: number, @Query() body: GetMessageBodyDTO): Promise<any> {
		return this.chatService.getAllMessageFromChannel(accessToken, channelId, body.perPage, body.page);
	}

	@Post('room')
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid body - body must include channelName(string), isPrivate(boolean) and password(null | string)", "Invalid body - password must be null if isPrivate is true", "Invalid password - password must be between 1-16 characters", "Invalid channelName - channelName must be between 1-16 characters"])
	@ApiOkResponse({ description: "Returns the newly created room", type: ChannelDTO})
	createRoom(@Headers('Authorization') accessToken: string, @Body() body: PostRoomBodyDTO): any {
		return this.chatService.createRoom(accessToken, body.channelName, body.isPrivate, body.password);
	}

	@Post('room/member')
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid channelId - channel is not found", "Invalid channelId - requires admin privileges", "Invalid intraName - you are not friends with this user", "Invalid intraName - user is already a member of this channel"])
	@ApiOkResponse({ description: "Returns the newly added member. RULES: 1. Private rooms - you need to be admin to invite 2. Public invite - member options must all be set to false for self-join. 3. Public password - self join require password", type: MemberDTO})
	addMember(@Headers('Authorization') accessToken: string, @Body() body: PostRoomMemberBodyDTO): any {
		return this.chatService.addMember(accessToken, body.channelId, body.intraName, body.isAdmin, body.isBanned, body.isMuted, body.password);
	}

	@Patch('room')
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid body - body must include channelName(string), isPrivate(boolean) and password(null | string)", "Invalid body - password must be null if isPrivate is true", "Invalid channelName - channelName must be between 1-16 characters", "Invalid channelId - channel is not found", "Invalid password - password does not match", "Invalid password - password must be between 1-16 characters", "Invalid channelId - requires owner privileges"])
	@ApiOkResponse({ description: "Returns the updated room (requires owner privileges)", type: ChannelDTO})
	updateRoom(@Headers('Authorization') accessToken: string, @Body() body: PatchRoomBodyDTO): any {
		return this.chatService.updateRoom(accessToken, body.channelId, body.channelName, body.isPrivate, body.oldPassword, body.newPassword);
	}

	@Patch('room/member')
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid body - body must include channelId(number), intraName(string), isAdmin(boolean), isBanned(boolean) and isMuted(boolean)", "Invalid channelId - requires admin privileges", "Invalid channelId - channel is not found", "Invalid intraName - user is not a member of this channel"])
	@ApiOkResponse({ description: "Returns the updated member (requires admin privileges)", type: MemberDTO})
	updateMember(@Headers('Authorization') accessToken: string, @Body() body: PatchRoomMemberBodyDTO): any {
		return this.chatService.updateMember(accessToken, body.channelId, body.intraName, body.isAdmin, body.isBanned, body.isMuted);
	}

	@Delete('room/member')
	@UseGuards(AuthGuard)
	@ApiCommonHeader(["Invalid body - body must include channelId(number) and intraName(string)", "Invalid channelId - requires admin privileges", "Invalid channelId - channel is not found", "Invalid intraName - user is not a member of this channel"])
	@ApiOkResponse({ description: "Returns the deleted member (requires admin privileges)", type: MemberDTO})
	deleteMember(@Headers('Authorization') accessToken: string, @Body() body: DeleteRoomMemberBodyDTO): any {
		return this.chatService.deleteMember(accessToken, body.channelId, body.intraName);
	}
}