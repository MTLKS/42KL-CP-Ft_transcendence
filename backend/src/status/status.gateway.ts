import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { UseGuards, Headers } from '@nestjs/common';
import { StatusService } from './status.service';
import { AuthGuard } from 'src/guard/AuthGuard';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors : {origin: '*', credentials: true} })
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (private readonly statusService: StatusService) {}

	@UseGuards(AuthGuard)
	async handleConnection(client: any, @Headers() accessToken, ...args: any[]) {
		let intraName : string;
		client.on('userConnect', (receivedIntraName: string) => { intraName = receivedIntraName; });
		await this.statusService.userConnect(client.id, accessToken);
	}
	
	@UseGuards(AuthGuard)
	async handleDisconnect(client: any) {
		await this.statusService.userDisconnect(client.id);
	}
	
	@UseGuards(AuthGuard)
	@SubscribeMessage('changeStatus')
	async handleChangeStatus(@ConnectedSocket() client: Socket, newStatus: string, ){
		await this.statusService.userChangeStatus(client.id, newStatus);
	}
}