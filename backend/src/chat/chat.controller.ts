import { Body, Controller, Get, Headers, Param, Post, Patch, Delete } from "@nestjs/common";
import { AuthGuard } from "src/guard/AuthGuard";
import { ChatService } from "./chat.service";
import { UseGuards } from "@nestjs/common";

@Controller("chat")
export class ChatController {
	constructor (private readonly chatService: ChatService) {}
	
	@Get('member/:channelID')
	@UseGuards(AuthGuard)
	getMyMemberData(@Headers('Authorization') accessToken: string, @Param('channelID') channelId: number): any {
		return this.chatService.getMyMemberData(accessToken, channelId);
	}

	@Get('dm/channel')
	@UseGuards(AuthGuard)
	getAllDMChannel(@Headers('Authorization') accessToken: string): any {
		return this.chatService.getAllDMChannel(accessToken);
	}

	@Get('dm/message/:channelID')
	@UseGuards(AuthGuard)
	getMyDMMessages(@Headers('Authorization') accessToken: string, @Param('channelID') channelId: number): any {
		return this.chatService.getMyDMMessages(accessToken, channelId);
	}

	@Post('room')
	@UseGuards(AuthGuard)
	createRoom(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.chatService.createRoom(accessToken, body.channelName, body.isPrivate, body.password);
	}

	@Patch('room')
	@UseGuards(AuthGuard)
	updateRoom(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.chatService.updateRoom(accessToken, body.channelId, body.channelName, body.isPrivate, body.oldPassword, body.newPassword);
	}

	@Delete('room')
	@UseGuards(AuthGuard)
	deleteRoom(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.chatService.deleteRoom(accessToken, body.channelId);
	}
}