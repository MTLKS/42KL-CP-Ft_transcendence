import { GameRoom,CollisionResult } from "./gameRoom";
import { Player }  from "./player"; 
import { GameSetting } from "./gameSetting";
import { Server } from "socket.io";
import { GameStateDTO, FieldEffectDTO } from "src/dto/gameState.dto";
import { MatchService } from "src/match/match.service";
import { Circle } from "./circle";
import { Block } from "./block";
import { UserService } from "src/user/user.service";

export class DeathGameRoom extends GameRoom{

	constructor (player1: Player, player2: Player, gameType: string, setting: GameSetting, matchService: MatchService, userService: UserService){
		super(player1, player2, gameType, setting, matchService, userService);
	}

	gameUpdate(server: Server){
		this.Ball.update();
		let score = this.Ball.checkContraint(this.canvasWidth, this.canvasHeight);
		if (score!=0){
			if (score == 1){
				this.player1Score++;
				this.lastWinner = "player1";
			}
			else{
				this.player2Score++;
				this.lastWinner = "player2";
			}
			this.resetTime = Date.now();
			this.gameReset = true;
		}
		this.gameCollisionDetection();
	}

	gameCollisionDetection(){
		let result = null;
		if (this.Ball.posX > this.canvasWidth * 0.85){
			// result = this.objectCollision(this.Ball, this.rightPaddle); //TODO: uncomment
		}
		else if(this.Ball.posX < this.canvasWidth * 0.15){
			// result = this.objectCollision(this.Ball, this.leftPaddle); //TODO: uncomment
		}
		
		if (result && result.collided){
			console.log(this.Ball.velX);
			this.Ball.collisionResponse(result.collideTime, result.normalX, result.normalY);
			if (this.Ball.velX < 0)
				this.Ball.initAcceleration(-1, 0);
			else
				this.Ball.initAcceleration(1, 0);
		}
	}
}