export class GameSetting{
	canvasWidth: number;
	canvasHeight: number;
	ballSpeedX: number;
	ballSpeedY: number;

	ballSize: number;
	paddleWidth: number;
	paddleHeight: number;
	paddleOffsetX: number;
	paddleOffsetY: number;

	constructor(){
		this.canvasWidth = 1600;
		this.canvasHeight = 900;
		this.ballSpeedX = 5;
		this.ballSpeedY = 1;
		this.ballSize = 10;
		this.paddleWidth = 15;
		this.paddleHeight = 100;
		this.paddleOffsetX = 30;
		this.paddleOffsetY = 50;
	}
}