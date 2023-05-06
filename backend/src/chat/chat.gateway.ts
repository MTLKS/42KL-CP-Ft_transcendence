import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody, OnGatewayConnection } from "@nestjs/websockets"
import { AuthGuard } from "src/guard/AuthGuard";
import { ChatService } from "./chat.service"
import { UseGuards } from "@nestjs/common";
import { Socket, Server } from "socket.io"

@WebSocketGateway({ cors: { origin: "*" }, namespace : "/chat", })
export class ChatGateway implements OnGatewayConnection {
	constructor (private readonly chatService: ChatService) {}

	@WebSocketServer()
	server: Server;

	@UseGuards(AuthGuard)
	async handleConnection(client: any) {
		await this.chatService.userConnect(client);
	}
	
	@UseGuards(AuthGuard)
	@SubscribeMessage('sendMessage')
	async sendMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		await this.chatService.sendMessage(client, this.server, body.intraName, body.message);
	}

	// Called when user connect or finish from game. Get all unread messages and join all rooms
	// @SubscribeMessage('listen')
	// async listen(@ConnectedSocket() client: Socket){
	// 	await this.chatService.joinAllRoom(client);
	// }

	// Called when user start a game, so that incoming message will not disturb the user
	// @SubscribeMessage('doNotDisturb')
	// async doNotDisturb(@ConnectedSocket() client: Socket){
	// 	await this.chatService.leaveAllRoom(client);
	// }

	// Called when user open a chat, get all messages of that chat. Make all unread messages read
	// @SubscribeMessage('onChat')
	// onChat(@MessageBody() body: any, @ConnectedSocket() client: Socket){
	// 	const MESSAGES = this.chatService.findAllMessages(body.roomId);
	// 	client.emit('allMessages', MESSAGES);
	// }
}