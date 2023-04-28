import { Injectable, Inject } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/user.service";

// interface Game {
// 	player1_i
// }

@Injectable()
export class GameService {
	constructor(
		private readonly userService: UserService
		) {}

	queue = [];
	ingame = [];

	async joinQueue(client: Socket, server: Server) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return;
		if (this.ingame.find(e => e.intraName === USER_DATA.intraName)) {
			console.log(`${USER_DATA.intraName} is already in a game.`);
			client.emit('error', { error: 'already ingame' });
			return;
		}
		if (this.queue.find(e => e.intraName === USER_DATA.intraName)) {
			console.log(`${USER_DATA.intraName} is already in the queue.`);
			client.emit('error', { error: 'already in queue' });
			return;
		}
		console.log(`${USER_DATA.intraName} joins queue as ${client.id}.`);
		this.queue.push({intraName: USER_DATA.intraName, socket: client});
		console.log(this.queue);
		
		if (this.queue.length >= 2) {
			var player1 = this.queue.pop();
			this.ingame.push(player1);
			var player2 = this.queue.pop();
			this.ingame.push(player2);

			this.startGame(player1, player2, server);
		}
	}

	async leaveQueue(client: Socket) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
			if (USER_DATA.error !== undefined)
				return;
			this.queue = this.queue.filter(function(e) { return e.intraName !== USER_DATA.intraName });
			console.log(`${USER_DATA.intraName} left queue as ${client.id}.`);
			console.log(this.queue);
	}

	// const ALL_GAME: 

	//TODO: generate unique id
	createGameRoom() : string {
		return 'room';
	}

	async startGame(player1: any, player2: any, server: Server){
		console.log(`Game start with ${player1.intraName} and ${player2.intraName}`);
		player1.socket.emit('game', `game start: opponent = ${player2.intraName}`);
		player2.socket.emit('game', `game start: opponent = ${player1.intraName}`);
		console.log(player1, player2);
		
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
		//TODO : remove users from ingame list
	}

	gameLoop(server: any){
		console.log("start");
		setInterval(() => {
			server.emit('gameLoop', {data: 'test'});
		}, 1000/60);
	}
}