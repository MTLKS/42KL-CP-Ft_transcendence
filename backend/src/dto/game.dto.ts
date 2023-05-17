export class GameDTO{
	ballPosX: number;
	ballPosY: number;
	ballVelX: number;
	ballVelY: number;
	leftPaddlePosY: number;
	rightPaddlePosY: number;
	player1Score: number;
	player2Score: number;

	constructor(ballPosX: number, ballPosY: number, ballVelX: number, ballVelY: number, leftPaddlePosY: number, rightPaddlePosY: number, player1Score: number, player2Score: number){
		this.ballPosX = ballPosX;
		this.ballPosY = ballPosY;
		this.ballVelX = ballVelX;
		this.ballVelY = ballVelY;
		this.leftPaddlePosY = leftPaddlePosY;
		this.rightPaddlePosY = rightPaddlePosY;
		this.player1Score = player1Score;
		this.player2Score = player2Score;
	}
}