import { Rect } from "./rect";
import { Ball } from "./ball";
import { PowerUp } from "../game.service";

/**
 * @param powerUp current powerUp for paddle
 * @param sizeIncrement size increment when using using size powerUp
 * @param energized boolean variable to check the paddle is energized
 * @param speedIncrementX speed increment in x direction when using speed powerUp
 * @param speedIncrementY speed increment in y direction when using speed powerUp
 * @param lastPosY Position of paddle in previous frame
 * @param prevDeltas Array of previous deltas of paddle position. Used to calculate spin
 * @param spinRequirement Minimum delta required to trigger spin
 * @param spinForce Force of spin
 */
export class Paddle extends Rect {
	powerUp: PowerUp;
	sizeIncrement: number;
	speedIncrementX: number;
	speedIncrementY: number;
	lastPosY: number;
	prevDeltas: number[] =[];
	spinRequirement: number;
	spinForce: number;


	constructor(posX, posY, width, height, mass: number=1, powerUp: PowerUp = PowerUp.NORMAL) {
		super(posX, posY, width, height, mass);
		this.powerUp = powerUp;
		this.lastPosY = 0;

		//Config Setting for PowerUp
		this.sizeIncrement = 1.2;
		this.speedIncrementX = 5;
		this.speedIncrementY = 3;
		this.spinRequirement = 3;
		this.spinForce = 1.5;

		if (this.powerUp == PowerUp.SIZE){
			this.height *= this.sizeIncrement;
		}
	}

	paddleCollisionAction(ball: Ball, collideTime: number, normalX: number, normalY: number){
		const avgDelta = this.prevDeltas.reduce((a, b) => a + b, 0) / this.prevDeltas.length;
		if (ball.energized == true && this.powerUp != PowerUp.SPEED){
			ball.resetVelocity();
			ball.energized = false;
		}
		if (Math.abs(avgDelta) > this.spinRequirement){
			ball.spin(-this.spinForce * avgDelta)
			if (this.powerUp == PowerUp.SPIN){
				ball.spin(-this.spinForce * avgDelta * 2);
			}
		}
		switch (this.powerUp){
			case PowerUp.NORMAL:
				ball.collisionResponse(collideTime, normalX, normalY);
				break;
			case PowerUp.SIZE:
				ball.collisionResponse(collideTime, normalX, normalY);
				break;
			case PowerUp.SPEED:
				ball.collisionResponse(collideTime, normalX, normalY);
				ball.energizedBall(this.speedIncrementX, this.speedIncrementY);
				ball.energized = true;
				break;
			case PowerUp.SPIN:
				ball.collisionResponse(collideTime, normalX, normalY);
		}
	}

	updateDelta(){
		let delta = this.posY - this.lastPosY;
		this.lastPosY = this.posY;
		this.prevDeltas.push(delta);
		if (this.prevDeltas.length > 5){
			this.prevDeltas.shift();
		}
	}
}
