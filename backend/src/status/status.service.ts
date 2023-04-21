import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "src/entity/status.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class StatusService {
	constructor(@InjectRepository(Status) private statusRepository: Repository<Status>, private userService: UserService) {}

	async userConnect(client: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined) {
			return USER_DATA;
		}
		const STATUS = await this.statusRepository.find({ where: {intraName: USER_DATA.intraName} });
		if (STATUS.length !== 0) {
			STATUS[0].clientId = client.id;
			this.statusRepository.save(STATUS[0]);
			return STATUS[0];
		} else {
			const NEW_STATUS = new Status(USER_DATA.intraName, client.id, "ONLINE");
			this.statusRepository.save(NEW_STATUS);
			return NEW_STATUS;
		}
	}
	
	async userDisconnect(client: any): Promise<any> {
		return await this.statusRepository.delete({ clientId: client.id });
	}

	async userChangeStatus(client: any, newStatus: string) {
		console.log(client.id);
		console.log("received");
		// console.log(client);
		// console.log(newStatus);
		// const INDEX = this.activeUsers.findIndex((user) => user.client === client);
		// if (INDEX !== -1) {
		// 	this.activeUsers[INDEX].status = status;
		// }
		// console.log(this.activeUsers);
	}
}