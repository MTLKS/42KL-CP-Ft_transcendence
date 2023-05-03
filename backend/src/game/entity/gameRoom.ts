import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { GameSetting } from "./settings";
import { Server } from "socket.io";
import { GameDTO } from "src/dto/game.dto";


export class GameRoom{
	roomID: string;
	player1Id: string;
	player2Id: string;
	canvasWidth: number;
	canvasHeight: number;
	ballInitSpeedX: number;
	ballInitSpeedY: number;
	Ball: Ball;
	leftPaddle: Paddle;
	rightPaddle: Paddle;
	interval: NodeJS.Timer | null;
	lastWinner: string;
	player1Score: number;
	player2Score: number;
	gameEnded: boolean;

	constructor(player1_id: string, player2_id: string, setting: GameSetting){
		this.roomID = 'Game: ';
		this.player1Id = player1_id;
		this.player2Id = player2_id;
		this.canvasWidth = setting.canvasWidth;
		this.canvasHeight = setting.canvasHeight;
		this.ballInitSpeedX = setting.ballSpeedX;
		this.ballInitSpeedY = setting.ballSpeedY;
		
		this.Ball = new Ball(this.canvasWidth / 2, this.canvasHeight / 2, setting.ballSize, setting.ballSize);
		this.leftPaddle = new Paddle(setting.paddleOffsetX, this.canvasHeight / 2, setting.paddleWidth, setting.paddleHeight);
		this.rightPaddle = new Paddle(this.canvasWidth - setting.paddleOffsetX - setting.paddleWidth, this.canvasHeight / 2, setting.paddleWidth, setting.paddleHeight);
		this.interval = null;
		
		this.lastWinner = '';
		this.player1Score = 0;
		this.player2Score = 0;
		this.gameEnded = false;
	}

	generateRoomID(player1_name: string, player2_name: string){
		// this.roomID = "Test";
		this.roomID = "Game: " + player1_name + ' vs ' + player2_name;
	}

	async run(server: Server){
		this.resetGame();
		if (this.interval == null && !this.gameEnded){
			this.interval = setInterval(() => {
				this.gameUpdate();
				server.to(this.roomID).emit('gameLoop',
					new GameDTO(this.Ball.posX, this.Ball.posY, this.Ball.velX, 
						this.Ball.velY,this.leftPaddle.posY + 50, this.rightPaddle.posY + 50, this.player1Score, this.player2Score));
			},1000/60);
		}
	}

	gameUpdate(){
		this.Ball.update();
		this.Ball.checkContraint(this.canvasWidth, this.canvasHeight);
		// console.log(this.leftPaddle.posY);
		this.gameCollisionDetection();
	}

	objectCollision(ball: Ball, paddle: Paddle){
		let xInvEntry, yInvEntry;
		let xInvExit, yInvExit;
		let xEntry, yEntry;
		let xExit, yExit;
		let entryTime, exitTime;

		if (ball.velX > 0){
			xInvEntry = paddle.posX - (ball.posX + ball.width);
			xInvExit = (paddle.posX + paddle.width) - ball.posX;
		}
		else{
			xInvEntry = (paddle.posX + paddle.width) - ball.posX;
			xInvExit = paddle.posX - (ball.posX + ball.width);
		}
		if (ball.velY > 0){
			yInvEntry = paddle.posY - (ball.posY + ball.height);
			yInvExit = (paddle.posY + paddle.height) - ball.posY;
		}
		else{
			yInvEntry = (paddle.posY + paddle.height) - ball.posY;
			yInvExit = paddle.posY - (ball.posY + ball.height);
		}

		if (ball.velX == 0){
			xEntry = -Infinity;
			xExit = Infinity;
		}
		else{
			xEntry = xInvEntry / ball.velX;
			xExit = xInvExit / ball.velX;
		}
		if (ball.velY == 0){
			yEntry = -Infinity;
			yExit = Infinity;
		}
		else{
			yEntry = yInvEntry / ball.velY;
			yExit = yInvExit / ball.velY;
		}

		entryTime = Math.max(xEntry, yEntry);
		exitTime = Math.min(xExit, yExit);

		if (entryTime > exitTime || xEntry < 0 && yEntry < 0 || xEntry > 1 || yEntry > 1){
			return ;
		}
		else{
			let normalX = 0;
			let normalY = 0;
			if (xEntry > yEntry){
				if (xInvEntry < 0){
					normalX = 1;
				}
				else{
					normalX = -1;
				}
			}
			else{
				if (yInvEntry < 0){
					normalY = 1;
				}
				else{
					normalY = -1;
				}
			}
			ball.collisionResponse(entryTime, normalX, normalY);
		}
	}

	gameCollisionDetection(){
		if (this.Ball.posX > this.canvasWidth / 2){
			this.objectCollision(this.Ball, this.rightPaddle);
		}
		else{
			this.objectCollision(this.Ball, this.leftPaddle);
		}
	}

	updatePlayerPos(playerID: string, value: number){
		this.leftPaddle.posY = value - 50;
		this.rightPaddle.posY = value - 50;
		// if (playerID == this.player1Id){
		// 	this.leftPaddle.posY = value;
		// }
		// else if (playerID == this.player2Id){
		// 	this.rightPaddle.posY = value;
		// }
	}

	/**
	 * Reset the game state. Called when game first started or if one player score
	 * 	Set the ball position to the center of the canvas
	 * 	Set the ball velocity to 0
	 * 	Check which player score and set ball velocity to the opposite side
	 */
	resetGame(){
		this.Ball.posX = this.canvasWidth / 2;
		this.Ball.posY = this.canvasHeight / 2;
		if (this.lastWinner.length == 0){
			this.Ball.velX = this.ballInitSpeedX * (Math.round(Math.random()) === 0 ? -1 : 1);
			this.Ball.velY = this.ballInitSpeedY * (Math.round(Math.random()) === 0 ? -1 : 1);
		}
		else if (this.lastWinner == "player1"){
			this.Ball.velX = this.ballInitSpeedX;
			this.Ball.velY = this.ballInitSpeedY * (Math.round(Math.random()) === 0 ? -1 : 1);
		}
		else if (this.lastWinner == "player2"){
			this.Ball.velX = -this.ballInitSpeedX;
			this.Ball.velY = this.ballInitSpeedY * (Math.round(Math.random()) === 0 ? -1 : 1);
		}
	}

	async countdown(seconds: number) : Promise<void>{
		let counter = seconds;
		while (counter >= 0) {
			counter--;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}
}