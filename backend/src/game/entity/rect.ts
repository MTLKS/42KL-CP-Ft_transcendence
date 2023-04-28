// export class Rect{
// 	x : number;
// 	y : number;
// 	width : number;
// 	height : number;
// 	velX : number;
// 	velY : number;
	
// 	constructor(x, y, width, height){
// 		this.x = x;
// 		this.y = y;
// 		this.width = width;
// 		this.height = height;
// 		this.velX = 0;
// 		this.velY = 0;
// 	}

// 	update(){
// 		this.x += this.velX;
// 		this.y += this.velY;
// 	}

// 	checkBorderCollision(width, height){
// 		//Left border
// 		if (this.x < 0){
// 			this.x = 0;
// 			this.velX *= -1;
// 		}
// 		//Right border
// 		if (this.x + this.width > width){
// 			this.x = width - this.width;
// 			this.velX *= -1;
// 		}
// 		//Top border
// 		if (this.y < 0){
// 			this.y = 0;
// 			this.velY *= -1;
// 		}
// 		//Bottom border
// 		if (this.y + this.height > height){
// 			this.y = height - this.height;
// 			this.velY *= -1;
// 		}
// 	}

// 	checkCollision(rect){

// 	}
// }

export class Rect{
	posX : number;
	posY : number;
	width : number;
	height : number;

	constructor (posX, posY, width, height){
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
	}

	
}