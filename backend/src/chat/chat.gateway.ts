import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets"
import { Socket, Server } from "socket.io"
import { ChatService } from "./chat.service"

@WebSocketGateway({ cors: { origin: "*" }, namespace :"\chat", })
export class ChatGateway {
	constructor (private readonly chatService: ChatService) {}

	@WebSocketServer()
	server: Server;

	//Received message from client, add emit it to respective room
	@SubscribeMessage('msgToServer')
	async handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket){
		const ROOM_ID = await this.chatService.joinRoom(body.roomId, client);
		this.chatService.addMessage(ROOM_ID, body.message);
		this.server.to(ROOM_ID).emit('msgToClient', {
			message: body.message,
		});
	}

	//Called when user join a new group
	@SubscribeMessage('joinRoom')
	async joinRoom(@MessageBody() body: any, @ConnectedSocket() client: Socket){
		await this.chatService.joinRoom(body.roomId, client);
	}

	//Called when user connect or finish from game. Get all unread messages and join all rooms
	@SubscribeMessage('listen')
	async listen(@ConnectedSocket() client: Socket){
		await this.chatService.joinAllRoom(client);
	}

	//Called when user start a game, so that incoming message will not disturb the user
	@SubscribeMessage('doNotDisturb')
	async doNotDisturb(@ConnectedSocket() client: Socket){
		await this.chatService.leaveAllRoom(client);
	}

	//Called when user open a chat, get all messages of that chat. Make all unread messages read
	@SubscribeMessage('onChat')
	onChat(@MessageBody() body: any, @ConnectedSocket() client: Socket){
		const MESSAGES = this.chatService.findAllMessages(body.roomId);
		client.emit('allMessages', MESSAGES);
	}
}