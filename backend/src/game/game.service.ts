import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { GameDTO } from "src/dto/game.dto";
import { Ball } from "./entity/ball";
import { Socket, Server } from "socket.io";

interface GameData {
	player1_id: string;
	player2_id: string;
	canvasWidth: number;
	canvasHeight: number;
}

@Injectable()
export class GameService {
	constructor(private readonly userService: UserService) {}
		
	private gameState : GameDTO = {
		ballPosX: 0,
		ballPosY: 0,
		leftPaddlePosY: 0,
		rightPaddlePosY: 0,
	}
	
	private gameData : GameData = {
		player1_id: '',
		player2_id: '',
		canvasWidth: 100,
		canvasHeight: 100,
	}
	
	queue = [];
	ingame = [];
	private PADDLE_SPEED = 5;
	private BALL = new Ball(this.gameState.ballPosX, this.gameState.ballPosY, 10, 10);

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

		//SEt game data

		//Change both player status to in game
		this.BALL.initVelocity(5,2);
		this.gameLoop(server);
	}

	async gameEnd(player1: any, player2: any){
		player1.leave(this.createGameRoom());
		player2.leave(this.createGameRoom());

		//TODO : send result to user service
		//TODO : remove users from ingame list
	}

	playerMove(socketId: string, value: number){
		if (socketId == this.gameData.player1_id){
			this.gameState.leftPaddlePosY += value;
		}
		else if (socketId == this.gameData.player2_id){
			this.gameState.rightPaddlePosY += value;
		}
	}

	gameUpdate(gameState){
		this.BALL.update();
		gameState.ballPosX = this.BALL.posX;
		gameState.ballPosY = this.BALL.posY;
		this.BALL.checkContraint(gameState.canvasWidth,gameState.canvasHeight);
	}

	gameLoop(server: any){
		setInterval(() => {
			this.gameUpdate(this.gameState);
			server.emit('gameLoop', this.gameState);
		}, 1000/60);
	}
}