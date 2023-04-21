import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { StatusService } from './status.service';
import { Socket,Server } from 'socket.io';

@WebSocketGateway({ cors : {origin: '*', credentials: true} })
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	
	constructor (private readonly statusService: StatusService) {}

	async handleConnection(client: any, ...args: any[]) {
		client.on('userConnect', () => {});
		await this.statusService.userConnect(client);
	}
	
	async handleDisconnect(client: any) {
		await this.statusService.userDisconnect(client);
	}
	
	@SubscribeMessage('changeStatus')
	async handleChangeStatus(@ConnectedSocket() client: Socket, newStatus: string, ){
		this.server.emit('test', "hello");
		await this.statusService.userChangeStatus(client, newStatus);
	}
}