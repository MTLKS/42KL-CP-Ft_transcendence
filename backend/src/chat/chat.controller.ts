import { Controller, Post, Headers, Body } from '@nestjs/common';
import { AuthGuard } from 'src/guard/AuthGuard';
import { Controller, Post, Headers, Body } from '@nestjs/common';
import { AuthGuard } from 'src/guard/AuthGuard';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('dm')
  @UseGuards(AuthGuard)
  createNewDM(
    @Headers('Authorization') accessToken: string,
    @Body() body: any,
  ): any {
    return this.chatService.createNewDM(accessToken, body.receiverIntraName);
  }

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
