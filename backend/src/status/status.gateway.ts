import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { StatusService } from './status.service';
import { AuthGuard } from 'src/guard/AuthGuard';
import { UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors : {origin: 'localhost:5173'} })
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect{
	constructor (private readonly statusService: StatusService) {}

	@UseGuards(AuthGuard)
	async handleConnection(client: any, ...args: any[]) {
		let userId : number
		client.on('connectMessage', (receivedUserId: number) => {
			userId = receivedUserId;
		});
		console.log(client.id, userId, "connected");
		await this.statusService.userConnect(client.id, userId);
	}
	
	@UseGuards(AuthGuard)
	async handleDisconnect(client: any) {
		console.log(client.id, "disconnect");
		await this.statusService.userDisconnect(client.id);
	}
	
	@UseGuards(AuthGuard)
	@SubscribeMessage('changeStatus')
	async handleChangeStatus(@MessageBody() body: any, @ConnectedSocket() client: Socket){
		console.log(body);
		await this.statusService.userChangeStatus(client.id, body);
	}

}