import { Rect } from "./rect";
import { Ball } from "./ball";
import { PowerUp } from "../game.service";

/**
 * @param powerUp current powerUp for paddle
 * @param sizeIncrement size increment when using using size powerUp
 * @param energized boolean variable to check the paddle is energized
 * @param speedIncrementX speed increment in x direction when using speed powerUp
 * @param speedIncrementY speed increment in y direction when using speed powerUp
 */
export class Paddle extends Rect {
	powerUp: PowerUp;
	sizeIncrement: number;
	energized: boolean;
	speedIncrementX: number;
	speedIncrementY: number;
	lastPosY: number;
	prevDeltas: number[] =[];
	delta: number;
	spinRequirement: number;
	spinForce: number;

	constructor(posX, posY, width, height, mass: number=1, powerUp: PowerUp = PowerUp.NORMAL) {
		super(posX, posY, width, height, mass);
		this.powerUp = powerUp;
		this.lastPosY = 0;
		this.delta = 0;

		//Config Setting for PowerUp
		this.sizeIncrement = 1.2;
		this.speedIncrementX = 1;
		this.speedIncrementY = 0;
		this.spinRequirement = 3;
		this.spinForce = 1.5;

		if (this.powerUp == PowerUp.SIZE){
			this.height *= this.sizeIncrement;
		}
	}

	paddleCollisionAction(ball: Ball, collideTime: number, normalX: number, normalY: number, hitCount: number=0){
		const avgDelta = this.prevDeltas.reduce((a, b) => a + b, 0) / this.prevDeltas.length;
		if (Math.abs(avgDelta) > this.spinRequirement){
			ball.accelY = -this.spinForce * avgDelta; 
			if (this.powerUp == PowerUp.SPIN){
				ball.accelY = -this.spinForce * avgDelta * 2;
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
				// ball.velX = Math.sign(ball.velX) * (ball.initialSpeedX + (hitCount * this.speedIncrement));
				// ball.velY = Math.sign(ball.velY) * (ball.initialSpeedY + (hitCount * this.speedIncrement));
				break;
			case PowerUp.SPIN:
				ball.collisionResponse(collideTime, normalX, normalY);
		}
	}

	updateDelta(){
		this.delta = this.posY - this.lastPosY;
		this.lastPosY = this.posY;
		this.prevDeltas.push(this.delta);
		if (this.prevDeltas.length > 5){
			this.prevDeltas.shift();
		}
	}
}
