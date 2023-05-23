import { DynamicRect } from "./dynamicRect";

/**
 * Ball class. modify the check constraint function to score instead of bounce
 */
export class Ball extends DynamicRect{
	initialSpeedX: number;
	initialSpeedY: number;
	prevY: number;
	accelerating: boolean;
	hitObstacle: boolean;

	constructor (posX: number, posY: number, width: number, height: number, 
		initSpeedX: number, initSpeedY: number, mass: number = 1){
		super(posX, posY, width, height,mass);

		this.initialSpeedX = initSpeedX;
		this.initialSpeedY = initSpeedY;

		this.prevY = 3;
		this.accelerating = false;
		this.hitObstacle = false;
	}

	/**
	 * Return 1 or 2 if the ball hit the left or right border respectively.
	 * Return 0 otherwise.
	 */
	checkContraint(borderWidth: number, borderHeight: number) : number{
		if (this.posX <= 0){
			this.posX = 0;
			this.velX = 0;
			this.velY = 0;
			this.hitObstacle = true;
			return 2;
		}
		if (this.posX + this.width >= borderWidth){
			this.posX = borderWidth - this.width;
			this.velX = 0;
			this.velY = 0;
			this.hitObstacle = true;
			return 1;
		}
		if (this.posY <= 0){
			this.posY = 0;
			this.velY *= -1;
			this.hitObstacle = true;
			return 3
		}
		if (this.posY + this.height >= borderHeight){
			this.posY = borderHeight - this.height;
			this.velY *= -1;
			this.hitObstacle = true;
			return 3
		}
		return 0;
	}

	impulsCollisionResponse(object: DynamicRect, normalX, normalY) {
		let relVelocityX = object.velX - this.velX;
		let relVelocityY = object.velY - this.velY;		
		let velAlongNormal = relVelocityX * normalX + relVelocityY * normalY;
		
		if (velAlongNormal > 0) {
		  return;
		}

		let e = 1;
		let j = -(1 + e) * velAlongNormal;
		let invMass = 1 / this.mass;
		let otherInvMass = 1/object.mass;
		j /= invMass + otherInvMass;
		
		let impulseX = j * normalX;
		let impulseY = j * normalY;
		this.velX -= impulseX * invMass;
		this.velY -= impulseY * invMass;
		object.velX += impulseX * otherInvMass;
		object.velY += impulseY * otherInvMass;
	}

	update(){
		if (this.accelerating == false && this.accelY == 0){
			this.prevY = Math.abs(this.velY);
		}
		if (this.accelY != 0){
			this.accelerating = true;
		}
		if (this.accelerating == true){
			if (this.accelY == 0 && this.hitObstacle == true){
				this.accelerating = false;
				this.velY = this.prevY * Math.sign(this.velY);
			}
		}
		this.velX += this.accelX * (1 / 60);
		this.velY += this.accelY * (1 / 60);
		this.posX += this.velX;
		this.posY += this.velY;
	}
}