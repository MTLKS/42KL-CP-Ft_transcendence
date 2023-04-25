import { FriendshipService } from "src/friendship/friendship.service";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "src/entity/status.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class StatusService {
	constructor(@InjectRepository(Status) private statusRepository: Repository<Status>, private userService: UserService, private friendShipService: FriendshipService) {}

	// New user connection
	async userConnect(client: any, server: any): Promise<any> {
		client.on('userConnect', () => {});
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return USER_DATA;
		const STATUS = await this.statusRepository.find({ where: {intraName: USER_DATA.intraName} });
		client.join(USER_DATA.intraName);
		if (STATUS.length !== 0) {
			STATUS[0].clientId = client.id;
			await this.statusRepository.save(STATUS[0]);
			return STATUS[0];
		}
		const NEW_STATUS = new Status(USER_DATA.intraName, client.id, "ONLINE");
		await this.statusRepository.save(NEW_STATUS);
		server.to(USER_DATA.intraName).emit('statusRoom', { "intraName": USER_DATA.intraName, "status": "ONLINE" });
		return NEW_STATUS;
	}
	
	// User disconnection
	async userDisconnect(client: any, server: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return server.emit('statusRoom', { "error": "Invalid token - Token not found" });
		const STATUS = await this.statusRepository.find({ where: {clientId: client.id} });
		if (STATUS.length === 0)
			return server.emit('statusRoom', { "error": "Invalid client id - Client ID not found" });
		server.to(USER_DATA.intraName).emit('statusRoom', { "intraName": STATUS[0].intraName, "status": "OFFLINE" });
		return await this.statusRepository.delete({ clientId: client.id });
	}

	// User status change
	async changeStatus(client: any, server: any, newStatus: string): Promise<any> {
		const STATUS = await this.statusRepository.find({ where: {clientId: client.id} });
		if (STATUS.length === 0)
			return server.emit('changeStatus', { "error": "Invalid client id - Client ID not found" });
		if (newStatus === undefined || (newStatus.toUpperCase() != "ONLINE" && newStatus.toUpperCase() != "INGAME"))
			return server.emit('changeStatus', { "error": "Invalid status - status can only be ONLINE or INGAME" });
		server.to(STATUS[0].intraName).emit('changeStatus', { "intraName": STATUS[0].intraName, "status": newStatus.toUpperCase() });
		server.to(STATUS[0].intraName).emit('statusRoom', { "intraName": STATUS[0].intraName, "status": newStatus.toUpperCase() });
		STATUS[0].status = newStatus.toUpperCase();
		await this.statusRepository.save(STATUS[0])
		return STATUS[0];
	}

	// User join status room based on intraName
	async statusRoom(client: any, server: any, intraName: string, joining: boolean): Promise<any> {
		if (intraName === undefined)
			return ;
		if (joining === undefined)
			return server.to(intraName).emit('statusRoom', { "error": "Invalid body - joining(boolean) is undefined" });
		if (joining === true) {
			const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
			if (USER_DATA.error !== undefined)
				return server.emit('statusRoom', { "error": "Invalid token - Token not found" });
			const FRIEND_STATUS = await this.statusRepository.find({ where: {intraName: intraName} });
			const MY_STATUS = await this.statusRepository.find({ where: {intraName: USER_DATA.intraName} });
			if (FRIEND_STATUS.length === 0) {
				client.join(intraName);
				server.to(intraName).emit('statusRoom', { "intraName": intraName, "status": "OFFLINE" });
			} else {
				server.to(intraName).emit('statusRoom', { "intraName": MY_STATUS[0].intraName, "status": MY_STATUS[0].status });
				client.join(intraName);
				server.to(intraName).emit('statusRoom', { "intraName": FRIEND_STATUS[0].intraName, "status": FRIEND_STATUS[0].status });
			}
		} else {
			client.leave(intraName);
		}
	}
}