import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors : {origin: '*'}, namespace: 'game'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (private readonly gameService: GameService) {}

	@WebSocketServer()
	server: Server;

	handleConnection(@ConnectedSocket() client: Socket) {
		this.gameService.handleConnection(client);
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		this.gameService.handleDisconnect(client);
	}

	@SubscribeMessage('joinQueue')
	async handleJoinQueue(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		this.gameService.joinQueue(client, body.queue, this.server);
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
		const roomName = await this.gameService.joinGame({ intraName: 'test', socket: player1 }, { intraName: 'test', socket: player2 }, 'standard', this.server);
		await this.gameService.startGame(roomName, this.server);
	}

	@SubscribeMessage('gameEnd')
	async gameEnd(@ConnectedSocket() player1: Socket, @ConnectedSocket() player2: Socket){
		// await this.gameService.gameEnd(player1, player2);
	}

	@SubscribeMessage('playerMove')
	async handleMouse(@ConnectedSocket() client: Socket, @MessageBody() body: any){
		console.log(body);
		this.gameService.playerUpdate(client.id, body.roomID, body.y);
	}
}