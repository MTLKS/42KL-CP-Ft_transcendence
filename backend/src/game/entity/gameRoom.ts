import { Ball } from "./ball";
import { Rect } from "./rect";
import { GameSetting } from "./gameSetting";
import { Server } from "socket.io";
import { GameDTO } from "src/dto/game.dto";
import { GameStartDTO, GameEndDTO, GamePauseDTO, GameStateDTO } from "src/dto/gameState.dto";
import { Player } from "./player";
import { MatchService } from "src/match/match.service";
import { UserService } from "src/user/user.service";

export class CollisionResult{
	collided: boolean;
	collideTime : number;
	normalX: number;
	normalY: number;

	constructor(){
		this.collided = false;
		this.collideTime = 0;
		this.normalX = 0;
		this.normalY = 0;
	}
}

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
	leftPaddle: Rect;
	rightPaddle: Rect;
	interval: NodeJS.Timer | null;
	resetTime: number;
	lastWinner: string;
	player1Score: number;
	player2Score: number;
	winScore: number;
	gameEnded: boolean;
	gameReset: boolean;
	gamePaused: boolean;
	gamePauseDate: number | null;
	gamePausePlayer: string | null;
	_players: Array<string>;
	roomSettings: GameSetting;
	matchService: MatchService;
	userService: UserService;

	constructor(player1: Player, player2: Player, gameType: string, setting: GameSetting, matchService: MatchService, userService: UserService){
		this.roomID = player1.intraName + player2.intraName;
		this.gameType = gameType;
		this.player1 = player1;
		this.player2 = player2;
		this.canvasWidth = setting.canvasWidth;
		this.canvasHeight = setting.canvasHeight;
		this.ballInitSpeedX = setting.ballSpeedX;
		this.ballInitSpeedY = setting.ballSpeedY;
		
		this.Ball = new Ball(this.canvasWidth / 2, this.canvasHeight / 2, setting.ballSize, setting.ballSize);
		this.leftPaddle = new Rect(setting.paddleOffsetX, this.canvasHeight / 2, setting.paddleWidth, setting.leftPaddleHeight);
		this.rightPaddle = new Rect(this.canvasWidth - setting.paddleOffsetX - setting.paddleWidth, this.canvasHeight / 2, setting.paddleWidth, setting.rightPaddleHeight);
		this.interval = null;
		this._players = [player1.intraName, player2.intraName];
		this.lastWinner = '';
		this.player1Score = 0;
		this.player2Score = 0;
		this.winScore = setting.scoreToWin;
		this.gameReset = false;
		this.gamePaused = false;

		this.matchService = matchService;
		this.userService = userService;

		//Check for game mode
		this.roomSettings = setting;
	}

	
	async run(server: Server){
		this.resetGame(server);
		await this.countdown(3);
		if (this.interval == null){
			this.interval = setInterval(async () => {
			
				if (this.gameReset == true){
					this.resetGame(server);
					let timer = 2;
					let elapsedTime = (Date.now() - this.resetTime) / 1000;
					if (elapsedTime >= timer){
						this.gameReset = false;
					}
				}

				else if (this.gamePaused == true){
					if (Date.now() - this.gamePauseDate > 5000) {
						this.endGame(server, this.player1.intraName === this.gamePausePlayer ? this.player2.intraName : this.player1.intraName, "abandon");
					}
				}

				else{
					this.gameUpdate(server);
				}

				if (this.player1Score === this.roomSettings.scoreToWin || this.player2Score === this.roomSettings.scoreToWin){
					this.endGame(server, this.player1Score === this.roomSettings.scoreToWin ? this.player1.intraName : this.player2.intraName, "score");
				}

				server.to(this.roomID).emit('gameLoop',
					new GameDTO(this.Ball.posX, this.Ball.posY, this.Ball.velX, 
						this.Ball.velY,this.leftPaddle.posY + 50, this.rightPaddle.posY + 50, this.player1Score, this.player2Score));
			},1000/60);
		}
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

	objectCollision(ball: Ball, paddle: Rect) : CollisionResult{
		let xInvEntry, yInvEntry;
		let xInvExit, yInvExit;
		let xEntry, yEntry;
		let xExit, yExit;
		let entryTime, exitTime;

		let result = new CollisionResult();

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
			return result;
		}
		else{
			result.collided = true;
			result.collideTime = entryTime;
			if (xEntry > yEntry){
				if (xInvEntry < 0){
					result.normalX = 1;
				}
				else{
					result.normalX = -1;
				}
			}
			else{
				if (yInvEntry < 0){
					result.normalY = 1;
				}
				else{
					result.normalY = -1;
				}
			}
			return result;
		}
	}

	gameCollisionDetection(){
		let result = null;
		if (this.Ball.posX > this.canvasWidth * 0.85){
			result = this.objectCollision(this.Ball, this.rightPaddle);
		}
		else if(this.Ball.posX < this.canvasWidth * 0.15){
			result = this.objectCollision(this.Ball, this.leftPaddle);
		}
		
		if (result && result.collided){
			this.Ball.collisionResponse(result.collideTime, result.normalX, result.normalY);
		}
	}

	updatePlayerPos(socketId: string, value: number){
		if (socketId == this.player1.socket.id){
			this.leftPaddle.posY = value - 50;
		}
		if (socketId == this.player2.socket.id){
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
		this.gamePaused = false;
		this.gamePauseDate = null;
		this.gamePausePlayer = null;
		// console.log(`${player.intraName} reconnected to ${this.roomID}`);
	}

	// TODO: wait for reconnect, abandon game after x seconds
	togglePause(server: Server, pausePlayer: string) {
		if (this.gamePaused)
			this.endGameNoMatch();
		this.gamePaused = true;
		this.gamePauseDate = Date.now();
		this.gamePausePlayer = pausePlayer;
		server.to(this.roomID).emit('gameState', new GameStateDTO("GamePause", new GamePauseDTO(this.gamePauseDate)))
		// console.log(`game ${this.roomID} paused due to player disconnect`);
	}

	async endGame(server: Server, winner: string, wonBy: string) {
		clearInterval(this.interval);
		server.to(this.roomID).emit('gameState', new GameStateDTO("GameEnd", new GameEndDTO(this.player1Score, this.player2Score)));
		// console.log(`game ${this.roomID} ended`);
		this.gameEnded = true;
		this.matchService.createNewMatch(this.player1.intraName, this.player2.intraName, this.player1Score, this.player2Score, winner, this.gameType, wonBy);

		let loser: string;
		if (winner === this.player1.intraName)
			loser = this.player2.intraName;
		else
			loser = this.player1.intraName;
		const WINNER = await this.userService.getUserDataByIntraName(winner);
		const LOSER = await this.userService.getUserDataByIntraName(loser);

		let winnerElo = WINNER.elo;
		let loserElo = LOSER.elo;
		let expected = 1 / (10 ** ((loserElo - winnerElo) / 400) + 1)
		let change = Math.round(20 * (1 - expected));

		winnerElo += change;
		loserElo -= change;

		this.userService.updateUserElo(winner, winnerElo, true);
		this.userService.updateUserElo(loser, loserElo, false);
	}

	endGameNoMatch() {
		clearInterval(this.interval);
		this.gameEnded = true;
		// console.log(`game ${this.roomID} ended due to both players disconnect`);
	}

	/**
	 * Reset the game state. Called when game first started or if one player score
	 * 	Set the ball position to the center of the canvas
	 * 	Set the ball velocity to 0
	 * 	Check which player score and set ball velocity to the opposite side
	 */
	resetGame(server: Server){
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
		server.to(this.roomID).emit('gameLoop', new GameDTO(this.Ball.posX, this.Ball.posY, this.Ball.velX, this.Ball.velY,this.leftPaddle.posY + 50, this.rightPaddle.posY + 50, this.player1Score, this.player2Score));
	}

	async countdown(seconds: number) : Promise<void>{
		let counter = seconds;
		while (counter >= 0) {
			counter--;
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}
}