import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "src/entity/status.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class StatusService {
	constructor(@InjectRepository(Status) private statusRepository: Repository<Status>, private userService: UserService) {}

	async userConnect(clientId: string, accessToken: string): Promise<any> {
		console.log(accessToken);
		if (accessToken === undefined)
			return { "error": "Invalid accessToken" }
		console.log('NEW USER CONNECTED');
		console.log(accessToken);
		const USER = await this.userService.getMyUserData(accessToken);
		const NEW_STATUS = new Status(clientId, USER.intraName, "ONLINE");
		console.log(NEW_STATUS);
		// this.statusRepository.save(NEW_STATUS);
		return NEW_STATUS;
	}
	
	async userDisconnect(clientId: string): Promise<any> {
		console.log('NEW USER DISCONNECTED');
		// const USER = await this.statusRepository.find({ where: {clientId: clientId} });
		// console.log(USER);
		// return await this.statusRepository.delete(USER[0].clientId);
	}

	async userChangeStatus(clientId: string, newStatus: string) {
		console.log(clientId);
		console.log(newStatus);
		// const INDEX = this.activeUsers.findIndex((user) => user.clientId === clientId);
		// if (INDEX !== -1) {
		// 	this.activeUsers[INDEX].status = status;
		// }
		// console.log(this.activeUsers);
	}
}