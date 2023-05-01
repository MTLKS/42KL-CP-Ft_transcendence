import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors : {origin: '*'}, namespace: 'game'})
export class GameGateway implements OnGatewayConnection{
	constructor (private readonly gameService: GameService) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket, ...args: any[]) {
		// console.log("Client connected", client.id);
		this.server.emit("test", "BOO");
	}

	@SubscribeMessage('joinQueue')
	async handleJoinQueue(@ConnectedSocket() client: Socket) {
		this.gameService.joinQueue(client, this.server);
	}

	@SubscribeMessage('leaveQueue')
	async handleLeaveQueue(@ConnectedSocket() client: Socket) {
		this.gameService.leaveQueue(client);
	}

	@SubscribeMessage('startGame')
	async startGame(@ConnectedSocket() player1: Socket, @ConnectedSocket() player2: Socket, @MessageBody() body: any){
		// const BODY = JSON.parse(body);
		const BODY = body;

		//May send info such as clientID, player name through socket.data
		// console.log(player1.data);
		await this.gameService.startGame(player1, player2, this.server);
	}

	@SubscribeMessage('gameEnd')
	async gameEnd(@ConnectedSocket() player1: Socket, @ConnectedSocket() player2: Socket){
		await this.gameService.gameEnd(player1, player2);
	}

	@SubscribeMessage('playerMove')
	async handleKeyDown(@ConnectedSocket() client: Socket, @MessageBody() body: any){
		// console.log(body);
		this.gameService.playerUpdate(client.id, body.y);
	}
}