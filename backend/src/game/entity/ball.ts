import { DynamicRect } from "./dynamicRect";

/**
 * Ball class. modify the check constraint function to score instead of bounce
 */
export class Ball extends DynamicRect{
	constructor (posX, posY, width, height, mass = 1){
		super(posX, posY, width, height,mass);
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
			return 2;
		}
		if (this.posX + this.width >= borderWidth){
			this.posX = borderWidth - this.width;
			this.velX = 0;
			this.velY = 0;
			return 1;
		}
		if (this.posY <= 0){
			this.posY = 0;
			this.velY *= -1;
		}
		if (this.posY + this.height >= borderHeight){
			this.posY = borderHeight - this.height;
			this.velY *= -1;
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



}