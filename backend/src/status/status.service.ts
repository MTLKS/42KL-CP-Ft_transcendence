import { FriendshipService } from "src/friendship/friendship.service";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "src/entity/status.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class StatusService {
	constructor(@InjectRepository(Status) private statusRepository: Repository<Status>, private userService: UserService, private friendShipService: FriendshipService) {}

	async joinFriendRooms(client: any, intraName: string): Promise<any> {
		const FRIENDS = await this.friendShipService.getFriendshipByIntraNAme(intraName);
		for (let i = 0; i < FRIENDS.length; i++){
			if (FRIENDS[i].status == "ACCEPTED")
				FRIENDS[i].senderIntraName == intraName ? await client.join(FRIENDS[i].receiverIntraName) : await client.join(FRIENDS[i].senderIntraName);
		}
	}

	async userConnect(client: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined) {
			return USER_DATA;
		}
		const STATUS = await this.statusRepository.find({ where: {intraName: USER_DATA.intraName} });
		client.join(USER_DATA.intraName);
		this.joinFriendRooms(client, USER_DATA.intraName);
		if (STATUS.length !== 0) {
			STATUS[0].clientId = client.id;
			this.statusRepository.save(STATUS[0]);
			return STATUS[0];
		}
		const NEW_STATUS = new Status(USER_DATA.intraName, client.id, "ONLINE");
		this.statusRepository.save(NEW_STATUS);
		return NEW_STATUS;
	}
	
	async userDisconnect(client: any): Promise<any> {
		return await this.statusRepository.delete({ clientId: client.id });
	}

	async userChangeStatus(client: any, newStatus: string, server: any): Promise<any> {
		const STATUS = await this.statusRepository.find({ where: {clientId: client.id} });
		if (STATUS.length === 0)
			return server.emit({ "error": "Invalid client id" });
		if (newStatus.toUpperCase() != "ONLINE" && newStatus.toUpperCase() != "OFFLINE" && newStatus.toUpperCase() != "INGAME")
			return server.emit('changeStatus', { "error": "Invalid status - status can only be ONLINE, OFFLINE or INGAME" });
		server.to(STATUS[0].intraName).emit('changeStatus', { "intraName": STATUS[0].intraName, "status": newStatus.toUpperCase() });
		STATUS[0].status = newStatus.toUpperCase();
		this.statusRepository.save(STATUS[0])
		return server.emit('changeStatus', STATUS[0]);
	}
}