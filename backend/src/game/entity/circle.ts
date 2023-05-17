import { DynamicRect } from "./dynamicRect";

export class Circle{
	posX: number;
	posY: number;
	radius: number;

	constructor(posX: number, posY: number, radius: number){
		this.posX = posX;
		this.posY = posY;
		this.radius = radius;
	}

	checkInside(x: number, y: number): boolean{
		let distance = Math.sqrt(Math.pow(x - this.posX, 2) + Math.pow(y - this.posY, 2));
		return distance < this.radius;
	}

	pull(rect: DynamicRect, effectRadius: number, force: number){
		const dx = this.posX - rect.posX;
		const dy = this.posY - rect.posY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < this.radius * effectRadius && distance > this.radius){
			const theta = Math.atan2(dy, dx);
			const fg = force * 100 / (distance * distance);

			rect.accelX = -fg * Math.cos(theta);
			rect.accelY = -fg * Math.sin(theta);
		}
		else{
			rect.accelX = 0;
			rect.accelY = 0;
		}
		if (distance < this.radius){
			rect.velX = 0;
			rect.velY = 0;
		}
	}
	
}