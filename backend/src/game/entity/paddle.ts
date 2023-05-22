import { Rect } from "./rect";
import { Ball } from "./ball";
import { PowerUp } from "../game.service";

export class Paddle extends Rect {
	powerUp: PowerUp;
	sizeIncrement: number;
	speedIncrement: number;
	speedIncrementCount: number;

	constructor(posX, posY, width, height, mass = 1, powerUp = PowerUp.NORMAL) {
		super(posX, posY, width, height, mass);
		this.powerUp = powerUp;


		//Config Setting for PowerUp
		this.sizeIncrement = 1.2;
		this.speedIncrement = 1;
		this.speedIncrementCount = 0;

		if (this.powerUp == PowerUp.SIZE){
			this.height *= this.sizeIncrement;
		}
	}

	paddleCollisionAction(ball: Ball, collideTime: number, normalX: number, normalY: number, spin: boolean=false){
		switch (this.powerUp){
			case PowerUp.NORMAL:
				ball.collisionResponse(collideTime, normalX, normalY);
				break;
			case PowerUp.SIZE:
				ball.collisionResponse(collideTime, normalX, normalY);
				break;
		}
	}
}
