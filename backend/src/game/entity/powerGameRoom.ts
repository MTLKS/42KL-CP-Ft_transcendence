import { GameRoom,CollisionResult } from "./gameRoom";
import { Player }  from "./player";
import { Paddle } from "./paddle";
import { GameSetting } from "./gameSetting";
import { Server } from "socket.io";
import { GameStateDTO, FieldEffectDTO } from "src/dto/gameState.dto";
import { MatchService } from "src/match/match.service";
import { Circle } from "./circle";
import { Block } from "./block";
import { UserService } from "src/user/user.service";
import { GameDTO } from "src/dto/game.dto";
import { PowerUp } from "../game.service";

enum FieldEffect{
	NORMAL = 0,
	GRAVITY,
	TIME_ZONE,
	BLACK_HOLE,
	BLOCK
}

/**
 * Class for Game Room with Power Ups. Addition of few variables
 * @param startTime Time where the game start and the field effect changed
 * @param elapseTime Time elapsed since the game start or last field effect changed. Used to invoke field effect change
 * @param minTime Minimum time to change field effect
 * @param maxTime Maximum time to change field effect
 * @param fieldEffectTimer Time to change field effect. Will be in range of minTime and maxTime
 * @param effectContinuousTimer Time where the field effect present, will be 2 sec less than next change timer
 * @param needReset Boolean to check if the field need to be reset
 * @param currentEffect Current field effect
 * @param effectMagnitude Magnitude of the field effect, either 1 or -1. Only used for Gravity and TimeZone
 * @param circleObject Object that represent the field effect(for Timezone, Black Hole)
 * @param blockObject Object that represent the field effect(for Block)
 * @param insideField Boolean to check if the ball is inside the field effect(for time zone and black hole)
 * @param paddleTimer Time where the ball last hit the paddle
 * @param paddleElapseTime Time elapsed since the ball last hit the paddle
 * @param paddleResetTimer Maximum time where the ball will be reset if not touching paddle
 * @param fieldEffectArray Array of to store list field effect, used to randomize the field effect
 * @param paddleHitCount Number of time the ball hit the paddle, used to increase the speed when power up is speed.
 * (To prevent bug if ball hit paddle while in speed zone)
 */
export class PowerGameRoom extends GameRoom{
	startTime: number;
	elapseTime: number = 0;
	minTime: number;
	maxTime: number;
	fieldEffectTimer: number;
	effectContinuousTimer: number;
	needReset: boolean = false;
	currentEffect: FieldEffect;
	effectMagnitude: number = 0;
	circleObject: Circle = null;
	blockObject: Block = null;
	insideField: boolean = false;
	paddleTimer: number;
	paddleElapseTime: number = 0;
	paddleResetTimer: number;
	fieldEffectArray: number[] = [0,1,2,3,4];
	paddleHitCount: number;
	
	//Config Setting for Field Effect
	gravityPower: number;
	timeZoneRadius: number;
	timeZoneSpeedUp: number;
	timeZoneSlowDown: number;
	blackHoleRadius: number;
	blackHoleEffectRadius: number;
	blackHoleForce: number;
	blockSize: number;
	blockMass: number;



	constructor (player1: Player, player2: Player, gameType: string, setting: GameSetting, matchService: MatchService, userService: UserService,
		Player1PowerUp: PowerUp, Player2PowerUp: PowerUp){
		super(player1, player2, gameType, setting, matchService, userService);
		
		this.leftPaddle.powerUp = Player1PowerUp;
		this.rightPaddle.powerUp = Player2PowerUp;

		//Config Setting
		this.minTime = 10;
		this.maxTime = 20;
		this.paddleResetTimer = 10;

		//GRAVITY
		this.gravityPower = 10;

		//TIMEZONE
		this.timeZoneRadius = 250;
		this.timeZoneSpeedUp = 1.5;
		this.timeZoneSlowDown = 0.5;

		//BLACKHOLE
		this.blackHoleRadius = 20;
		this.blackHoleEffectRadius = 20;
		this.blackHoleForce = 500;

		//BLOCK
		this.blockSize = 200;
		this.blockMass = 10;
		
		this.startTime = Date.now();
		this.fieldEffectTimer = Math.random() * (this.maxTime - this.minTime) + this.minTime;
		this.effectContinuousTimer = Infinity;
		this.paddleTimer = Date.now();
		this.currentEffect = FieldEffect.NORMAL;

		this.paddleHitCount = 0;
	}

	gameUpdate(server: Server){
		this.elapseTime = (Date.now() - this.startTime) / 1000;
		this.paddleElapseTime = (Date.now() - this.paddleTimer) / 1000;
		this.Ball.update();

		this.leftPaddle.updateDelta();
		this.rightPaddle.updateDelta();

		let score = this.Ball.checkContraint(this.canvasWidth, this.canvasHeight);
		if (score == 1 || score == 2){
			if (score == 1){
				this.player1Score++;
				this.lastWinner = "player1";
			}
			else{
				this.player2Score++;
				this.lastWinner = "player2";
			}
			this.resetTime = Date.now();
			this.paddleTimer = Date.now();
			this.insideField = false;
			this.paddleHitCount = 0;
			this.gameReset = true;
		}

		if (score == 3){
			if (this.currentEffect != FieldEffect.GRAVITY){
				this.Ball.accelX = 0;
				this.Ball.accelY = 0;
			}
		}

		if (this.currentEffect == FieldEffect.GRAVITY){
			this.Ball.initAcceleration(0, this.gravityPower * this.effectMagnitude);
		}
		
		if (this.elapseTime >= this.fieldEffectTimer){
			this.fieldChange(server);
			this.startTime = Date.now();
			this.fieldEffectTimer = Math.random() * (this.maxTime - this.minTime) + this.minTime;
			this.needReset = true;
			this.effectContinuousTimer = this.fieldEffectTimer - 2;
		}
		else if (this.elapseTime >= this.effectContinuousTimer && this.needReset == true){
			this.needReset = false;
			this.fieldReset(server);
		}
		
		if (this.paddleElapseTime >= this.paddleResetTimer){
			this.paddleTimer = Date.now();
			this.insideField = false;
			this.resetGame(server);
		}

		if (this.circleObject != null){
			this.fieldEffect();
		}

		this.gameCollisionDetection();
		if (this.blockObject != null){
			this.blockObject.update();
			// console.log(this.blockObject.posX, this.blockObject.posY);
			this.blockObject.checkContraint(this.canvasWidth, this.canvasHeight);
			server.to(this.roomID).emit('gameLoop',new GameDTO(this.Ball.posX, this.Ball.posY, this.Ball.velX, 
				this.Ball.velY,
				this.leftPaddle.posY + (this.leftPaddle.height/2), this.rightPaddle.posY + (this.rightPaddle.height/2), 
				this.player1Score, this.player2Score, this.blockObject.posX + (this.blockSize/2), this.blockObject.posY + (this.blockSize/2)));
		}
		else{
			server.to(this.roomID).emit('gameLoop',new GameDTO(this.Ball.posX, this.Ball.posY, this.Ball.velX, 
				this.Ball.velY,this.leftPaddle.posY + (this.leftPaddle.height/2), this.rightPaddle.posY + (this.rightPaddle.height/2), this.player1Score, this.player2Score));
		}

	}

	gameCollisionDetection(){
		let result = null;

		if (this.Ball.posX > this.canvasWidth * 0.85){
			result = this.objectCollision(this.Ball, this.rightPaddle, -1);
		}
		else if(this.Ball.posX < this.canvasWidth * 0.15){
			result = this.objectCollision(this.Ball, this.leftPaddle, 1);
		}

		if (this.currentEffect == FieldEffect.BLOCK && this.blockObject != null){
			const BLOCK_COLLISION = this.objectCollision(this.Ball, this.blockObject, 0);
			
			if (BLOCK_COLLISION && BLOCK_COLLISION.collided){
				this.Ball.impulsCollisionResponse(this.blockObject, -BLOCK_COLLISION.normalX, -BLOCK_COLLISION.normalY);
				return;
			}
		}
		
		if (result && result.collided){
			this.paddleTimer = Date.now();
			this.Ball.accelX = 0;
			this.Ball.accelY = 0;
			//Check left paddle
			if (result.direction == 1){
				if (this.leftPaddle.powerUp == PowerUp.SPEED){
					this.paddleHitCount ++;
				}
				this.leftPaddle.paddleCollisionAction(this.Ball,
					result.collideTime,
					result.normalX,result.normalY,
					this.paddleHitCount);
			}
			//Check right paddle
			else if (result.direction == -1){
				if (this.rightPaddle.powerUp == PowerUp.SPEED){
					this.paddleHitCount ++;
				}
				this.rightPaddle.paddleCollisionAction(this.Ball,
					result.collideTime,
					result.normalX,result.normalY,
					this.paddleHitCount);
			}
		}
	}

	/**
	 * Field effect function that run on every frame. Only used for time zone and black hole
	 */
	fieldEffect(){
		const BALL_CENTER_X = this.Ball.posX + this.Ball.width / 2;
		const BALL_CENTER_Y = this.Ball.posY + this.Ball.height / 2;
		if (this.currentEffect == FieldEffect.TIME_ZONE && this.circleObject != null){
			if ((this.circleObject.checkInside(BALL_CENTER_X, BALL_CENTER_Y)== true) && this.insideField == false){
				this.insideField = true;
				this.Ball.velX *= this.effectMagnitude;
				this.Ball.velY *= this.effectMagnitude;
			}
			if((this.circleObject.checkInside(BALL_CENTER_X, BALL_CENTER_Y) == false) && this.insideField == true){
				this.insideField = false;
				this.Ball.velX /= this.effectMagnitude;
				this.Ball.velY /= this.effectMagnitude;
			}
		}
		else if (this.currentEffect == FieldEffect.BLACK_HOLE && this.circleObject != null){
			this.circleObject.pull(this.Ball, this.blackHoleEffectRadius, this.blackHoleForce);
		}
		
	}

	fieldChange(server: Server){
		// let effect = this.getRandomNum();
		let effect = 1;
		let spawnPos;
		switch (effect){
			case FieldEffect.NORMAL:
				this.currentEffect = FieldEffect.NORMAL;
				server.emit("gameState", new GameStateDTO("FieldEffect", new FieldEffectDTO("NORMAL", 0,0,0)));
				break;
			case FieldEffect.GRAVITY:
				let direction = Math.random();
				if (direction < 0.5){
					this.effectMagnitude = 1;
					server.emit("gameState", new GameStateDTO("FieldEffect",new FieldEffectDTO("GRAVITY", 0,0,1)));
				}
				else{
					this.effectMagnitude = -1;
					server.emit("gameState", new GameStateDTO("FieldEffect",new FieldEffectDTO("GRAVITY", 0,0,-1)));
				}
				this.currentEffect = FieldEffect.GRAVITY;
				break;
			case FieldEffect.TIME_ZONE:
				spawnPos = this.getRandomSpawnPosition(this.timeZoneRadius * 2);
				this.circleObject = new Circle(spawnPos.x, spawnPos.y, this.timeZoneRadius);
				let magnitude = Math.random();
				if (magnitude < 0.5){
					this.effectMagnitude = this.timeZoneSpeedUp;
				}
				else{
					this.effectMagnitude = this.timeZoneSlowDown
				}
				server.emit("gameState", new GameStateDTO("FieldEffect", new FieldEffectDTO("TIME_ZONE", spawnPos.x, spawnPos.y, this.effectMagnitude)));
				this.currentEffect = FieldEffect.TIME_ZONE;
				break;
			case FieldEffect.BLACK_HOLE:
				spawnPos = this.getRandomSpawnPosition(this.blackHoleRadius);
				this.circleObject = new Circle(spawnPos.x, spawnPos.y, this.blackHoleRadius);
				server.emit("gameState", new GameStateDTO("FieldEffect",new FieldEffectDTO("BLACK_HOLE", spawnPos.x, spawnPos.y, this.blackHoleForce)));
				this.currentEffect = FieldEffect.BLACK_HOLE;
				break;
			case FieldEffect.BLOCK:
				spawnPos = this.getRandomSpawnPosition(this.blockSize);
				this.blockObject = new Block(spawnPos.x, spawnPos.y, this.blockSize, this.blockSize, this.blockMass);
				server.emit("gameState", new GameStateDTO("FieldEffect",new FieldEffectDTO("BLOCK", spawnPos.x, spawnPos.y, 0)));
				this.currentEffect = FieldEffect.BLOCK;
				break;
		}
	}

	fieldReset(server: Server){
		if (this.circleObject != null){
			this.circleObject = null;
		}
		if (this.blockObject != null){
			this.blockObject = null;
		}
		if (this.currentEffect == FieldEffect.TIME_ZONE && this.insideField == true){
			this.insideField = false;
			this.Ball.velX /= this.effectMagnitude;
			this.Ball.velY /= this.effectMagnitude;
		}
		this.currentEffect = FieldEffect.NORMAL;
		this.Ball.initAcceleration(0,0);
		this.effectMagnitude = 0;
		server.emit("gameState", new GameStateDTO("FieldEffect", new FieldEffectDTO("NORMAL", 0,0,0)));
	}

	getBallQuadrant(){
		const xQuadrant = this.Ball.posX < this.canvasWidth / 2 ? 0 : 1;
		const yQuadrant = this.Ball.posY < this.canvasHeight / 2 ? 0 : 1;

		return xQuadrant + (yQuadrant * 2);
	}

	/**
	 * Return a random position for the power up to spawn. Will not spawn directly on ball.
	 * @param size size of block, and diameter of circle
	 */
	getRandomSpawnPosition(size: number){
		let ballQuadrant = this.getBallQuadrant();
		let arr = [];

		for (let i = 0; i < 4; i++){
			if (i != ballQuadrant){
				arr.push(i);
			}
		}

		let spawnQuadrant = arr[Math.floor(Math.random() * arr.length)];
		let minX, maxX, minY, maxY;
		
		if (spawnQuadrant %2 == 0){
			minX = this.canvasWidth * 0.15;
			maxX = this.canvasWidth * 0.5;
		}
		else{
			minX = this.canvasWidth * 0.5;
			maxX = this.canvasWidth * 0.85 - size;
		}
		if (spawnQuadrant / 2 < 1){
			minY = 0;
			maxY = this.canvasHeight * 0.5;
		}
		else{
			minY = this.canvasHeight * 0.5;
			maxY = this.canvasHeight - size;
		}
		
		let posX = Math.floor(Math.random() * (maxX - minX) + minX);
		let posY = Math.floor(Math.random() * (maxY - minY) + minY);

		return {x: posX, y: posY};
	}

	getRandomNum(): number{
		let index = Math.floor(Math.random() * this.fieldEffectArray.length);
		const SELECTED = this.fieldEffectArray[index];
		this.fieldEffectArray.splice(index, 1);

		if (this.fieldEffectArray.length < 2){
			this.fieldEffectArray = [0,1,2,3,4];
		}

		return SELECTED;
	}

}