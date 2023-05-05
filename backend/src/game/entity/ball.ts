import { Rect } from "./rect";

export class Ball extends Rect{
	velX : number;
	velY : number;
	accX : number;
	accY : number;

	constructor (posX, posY, width, height){
		super(posX, posY, width, height);
		this.velX = 0;
		this.velY = 0;
		this.accX = 0;
		this.accY = 0;
	}

	update(){
		this.velX += this.accX * (1/60);
		this.velY += this.accY * (1/60);
		this.posX += this.velX;
		this.posY += this.velY;
	}

	initVelocity(velX: number, velY: number){
		this.velX = velX;
		this.velY = velY;
	}

	addAcceleration(accX: number, accY: number){
		this.accX = accX;
		this.accY = accY;
	}

	checkContraint(borderWidth: number, borderHeight: number){
		if (this.posX < 0){
			this.posX = 0;
			this.velX *= -1;
		}
		if (this.posX + this.width > borderWidth){
			this.posX = borderWidth - this.width;
			this.velX *= -1;
		}
		if (this.posY < 0){
			this.posY = 0;
			this.velY *= -1;
		}
		if (this.posY + this.height > borderHeight){
			this.posY = borderHeight - this.height;
			this.velY *= -1;
		}
	}

	collisionResponse(collideTime: number, normalX: number, normalY: number){
		this.posX += this.velX * collideTime;
		this.posY += this.velY * collideTime;
		if (Math.abs(normalX) > 0.001){
			this.velX *= -1;
		}
		if (Math.abs(normalY) > 0.001){
			this.velY *= -1;
		}
	}
}