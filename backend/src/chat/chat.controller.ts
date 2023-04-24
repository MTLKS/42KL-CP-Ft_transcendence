import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
	constructor (private readonly chatService: ChatService) {}

	// //Get all chat of a user
	// @Get(':id')
	// async getAllChatByID(@Param('id') id: string): any{
	// 	return await this.chatService.getAllChatByID(id);
	// }

	// @Post()
	// async newChat(userId: number, @Body() body: any): any{
	// 	return await this.chatService.newChat(userId, body.visibility, body.password, body.members);
	// }

	// //Update chat, change password or visibility
	// @Patch()
	// async updateChatSetting(userId: number, @Body() body: any){
	// 	return await this.chatService.updateChatSetting(userId, body.chatId, body.visibility, body.password);
	// }

	// //Kick, ban or mute user
	// @Patch()
	// async updateChatMember(userId: number, @Body() body: any){
	// 	return await this.chatService.updateChatMember(userId, body.chatId, body.memberId, body.action);
	// }
}