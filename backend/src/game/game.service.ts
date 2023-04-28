import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { GameDTO } from "src/dto/game.dto";
import { Ball } from "./entity/ball";

interface GameData {
	player1_id: string;
	player2_id: string;
	canvasWidth: number;
	canvasHeight: number;
}

@Injectable()
export class GameService {
	constructor(
		private readonly userService: UserService
		) {}

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

	private PADDLE_SPEED = 5;
	private BALL = new Ball(this.gameState.ballPosX, this.gameState.ballPosY, 10, 10);

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

		//SEt game data

		//Change both player status to in game
		this.BALL.initVelocity(5,2);
		this.gameLoop(server);
	}

	async gameEnd(player1: any, player2: any){
		player1.leave(this.createGameRoom());
		player2.leave(this.createGameRoom());

		//TODO : send result to user service
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