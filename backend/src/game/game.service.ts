import { Injectable, Inject } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { UserService } from "src/user/user.service";

// interface Game {
// 	player1_i
// }

@Injectable()
export class GameService {
	constructor(
		private readonly userService: UserService
		) {}

	// const ALL_GAME: 

	//TODO: generate unique id
	createGameRoom() : string {
		return 'room';
	}

	async startGame(player1: any, player2: any, body: any, server: any){
		//Leave lobby room
		player1.join(this.createGameRoom());
		player2.join(this.createGameRoom());

		//Get both player info
		// console.log(body.name);
		// const TEST = this.userService.getUserDataByIntraName(body.name);
		// console.log(TEST);

		//Change both player status to in game

		this.gameLoop(server);
	}

	async gameEnd(player1: any, player2: any){
		player1.leave(this.createGameRoom());
		player2.leave(this.createGameRoom());

		//TODO : send result to user service
	}

	gameLoop(server: any){
		console.log("start");
		setInterval(() => {
			server.emit('gameLoop', {data: 'test'});
		}, 1000/60);
	}
}