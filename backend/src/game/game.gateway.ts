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
		this.gameService.handleDisconnect(this.server, client);
	}

	@SubscribeMessage('joinQueue')
	async handleJoinQueue(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		this.gameService.joinQueue(client, body.queue, this.server);
	}

	@SubscribeMessage('leaveQueue')
	async handleLeaveQueue(@ConnectedSocket() client: Socket) {
		this.gameService.leaveQueue(client);
	}

	@SubscribeMessage('ready')
	async handleReady(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		this.gameService.handleReady(client, body.powerup, this.server);
	}

	@SubscribeMessage('playerMove')
	async handlePlayerMove(@ConnectedSocket() client: Socket, @MessageBody() body: any){
		this.gameService.playerUpdate(client, body.gameRoom, body.x,body.y);
	}

	@SubscribeMessage('playerClick')
	async handlePlayerClick(@ConnectedSocket() client: Socket, @MessageBody() body: any){
		this.gameService.playerMouseUpdate(client, body.gameRoom, body.isMouseDown);
	}
}
