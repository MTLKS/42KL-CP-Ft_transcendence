import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { StatusService } from './status.service';
import { Socket,Server } from 'socket.io';
import { Body } from '@nestjs/common';

@WebSocketGateway({ cors : {origin: '*'} })
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (private readonly statusService: StatusService) {}
	
	@WebSocketServer() server: Server;

	async handleConnection(client: any) {
		await this.statusService.userConnect(client, this.server);
	}
	
	async handleDisconnect(client: any) {
		await this.statusService.userDisconnect(client, this.server);
	}
	
	@SubscribeMessage('changeStatus')
	async changeStatus(@ConnectedSocket() client: Socket, @Body() body: any) {
		await this.statusService.changeStatus(client, this.server, body.newStatus);
	}

	@SubscribeMessage('statusRoom')
	async joinStatusRoom(@ConnectedSocket() client: Socket, @Body() body: any) {
		await this.statusService.statusRoom(client, this.server, body.intraName, body.action);
	}
}