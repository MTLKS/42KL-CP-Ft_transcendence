import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { Module } from "@nestjs/common";

@Module({
	imports: [],
	controllers: [ChatController],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {}