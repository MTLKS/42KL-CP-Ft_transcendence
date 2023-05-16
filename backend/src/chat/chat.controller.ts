import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
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
	getMyDM(@Headers('Authorization') accessToken: string, @Param('channelID') channelId: number): any {
		return this.chatService.getMyDM(accessToken, channelId);
	}

	@Post('room')
	@UseGuards(AuthGuard)
	createRoom(@Headers('Authorization') accessToken: string, @Body() body: any): any {
		return this.chatService.createRoom(accessToken, body);
	}
}