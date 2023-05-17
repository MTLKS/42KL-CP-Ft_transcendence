export enum GameMode{
	STANDARD,
	POWER,
	sudden
}

export class GameSetting{
	canvasWidth: number;
	canvasHeight: number;
	ballSpeedX: number;
	ballSpeedY: number;

	ballSize: number;
	paddleWidth: number;
	leftPaddleHeight: number;
	rightPaddleHeight: number;
	paddleOffsetX: number;
	paddleOffsetY: number;

	scoreToWin: number;
	gameMode: GameMode;

	constructor(leftPaddleHeight: number, rightPaddleHeight: number, gameMode: GameMode){
		this.canvasWidth = 1600;
		this.canvasHeight = 900;
		this.ballSpeedX = 9;
		this.ballSpeedY = 3;
		this.ballSize = 10;
		this.paddleWidth = 15;
		this.leftPaddleHeight = leftPaddleHeight;
		this.rightPaddleHeight = rightPaddleHeight;
		this.paddleOffsetX = 30;
		this.paddleOffsetY = 50;
		this.scoreToWin = 10;
		this.gameMode = gameMode;
	}
}