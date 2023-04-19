import { InjectRepository } from "@nestjs/typeorm";
// import { Status } from "src/entity/status.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StatusService {
	// constructor(@InjectRepository(Status) private statusRepository: Repository<Status>) {}
	// private activeUsers: ActiveUserDTO[] = [];

	async userConnect(clientId: string, userId: number) {
		// this.activeUsers.push({
		// 	clientId: clientId,
		// 	userId: userId,
		// 	status : "online",
		// });
		// console.log(this.activeUsers);
		// const NEW_STATUS = new Status(clientId, userId, "ONLINE");
	}

	async userDisconnect(clientId: string){
		// const INDEX = this.activeUsers.findIndex((user) => user.clientId === clientId);
		// if (INDEX !== -1) {
		// 	this.activeUsers.splice(INDEX, 1);
		// }
		// console.log(this.activeUsers);
	}

	async userChangeStatus(clientId: string, status: string){
		// const INDEX = this.activeUsers.findIndex((user) => user.clientId === clientId);
		// if (INDEX !== -1) {
		// 	this.activeUsers[INDEX].status = status;
		// }
		// console.log(this.activeUsers);
	}
}