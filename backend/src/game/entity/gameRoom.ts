import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { GameSetting } from "./settings";
import { Server } from "socket.io";
import { GameDTO } from "src/dto/game.dto";
import { GameStartDTO, GameStateDTO } from "src/dto/gameState.dto";
import { Player } from "./player";


export class GameRoom{
	roomID: string;
	gameType: string;
	player1: Player;
	player2: Player;
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
	_players: Array<string>;

	constructor(player1: Player, player2: Player, gameType: string, setting: GameSetting){
		this.roomID = player1.intraName + player2.intraName;
		this.gameType = gameType;
		this.player1 = player1;
		this.player2 = player2;
		this.canvasWidth = setting.canvasWidth;
		this.canvasHeight = setting.canvasHeight;
		this.ballInitSpeedX = setting.ballSpeedX;
		this.ballInitSpeedY = setting.ballSpeedY;
		
		this.Ball = new Ball(this.canvasWidth / 2, this.canvasHeight / 2, setting.ballSize, setting.ballSize);
		this.leftPaddle = new Paddle(setting.paddleOffsetX, this.canvasHeight / 2, setting.paddleWidth, setting.paddleHeight);
		this.rightPaddle = new Paddle(this.canvasWidth - setting.paddleOffsetX - setting.paddleWidth, this.canvasHeight / 2, setting.paddleWidth, setting.paddleHeight);
		this.interval = null;
		
		this._players = [player1.intraName, player2.intraName];
		this.lastWinner = '';
		this.player1Score = 0;
		this.player2Score = 0;
		this.gameEnded = false;
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

	updatePlayerPos(socketId: string, value: number){
		if (socketId == this.player1.socket.id){
			this.leftPaddle.posY = value - 50;
		}
		else if (socketId == this.player2.socket.id){
			this.rightPaddle.posY = value - 50;
		}
	}

	resumeGame(player: Player) {
		let opponentIntraName = '';
		if (player.intraName === this.player1.intraName)
		{
			this.player1 = player;
			opponentIntraName = this.player2.intraName;
		}
		else if (player.intraName === this.player2.intraName)
		{
			this.player2 = player;
			opponentIntraName = this.player1.intraName;
		}
		player.socket.join(this.roomID);
		player.socket.emit('gameState', new GameStateDTO("GameStart", new GameStartDTO(opponentIntraName,  this.gameType, player === this.player1, this.roomID)));
		console.log(`${player.intraName} reconnected to ${this.roomID}`);
	}

	// TODO: wait for reconnect, abandon game after x seconds
	pauseGame() {
		console.log(`game ${this.roomID} paused due to player disconnect`);
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