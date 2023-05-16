import { GameRoom,CollisionResult } from "./gameRoom";
import { Player }  from "./player"; 
import { GameSetting } from "./gameSetting";
import { Server } from "socket.io";
import { GameStateDTO, FieldEffectDTO } from "src/dto/gameState.dto";
import { MatchService } from "src/match/match.service";
import { Circle } from "./circle";
import { Block } from "./block";
import { simd } from "sharp";
import { UserService } from "src/user/user.service";

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
 * @param currentEffect Current field effect
 * @param effectMagnitude Magnitude of the field effect, either 1 or -1. Only used for Gravity and TimeZone
 * @param circleObject Object that represent the field effect(for Timezone, Black Hole)
 * @param blockObject Object that represent the field effect(for Block)
 * @param paddleTimer Time where the ball last hit the paddle
 * @param paddleElapseTime Time elapsed since the ball last hit the paddle
 * @param paddleResetTimer Maximum time where the ball will be reset if not touching paddle
 */
export class PowerGameRoom extends GameRoom{
	startTime: number;
	elapseTime: number = 0;
	minTime: number;
	maxTime: number;
	fieldEffectTimer: number;
	effectContinuousTimer: number;
	currentEffect: FieldEffect;
	effectMagnitude: number = 0;
	circleObject: Circle = null;
	blockObject: Block = null;
	paddleTimer: number;
	paddleElapseTime: number = 0;
	paddleResetTimer: number;
	
	//Config Setting for Power Ups
	gravityPower: number;
	timeZoneRadius: number;
	timeZonefactor: number;
	blackHoleRadius: number;
	blackHoleEffectRadius: number;
	blackHoleForce: number;
	blockSize: number;
	blockMass: number;


	constructor (player1: Player, player2: Player, gameType: string, setting: GameSetting, matchService: MatchService, userService: UserService){
		super(player1, player2, gameType, setting, matchService, userService);

		//Config Setting
		this.minTime = 10;
		this.maxTime = 20;
		this.paddleResetTimer = 10;

		//GRAVITY
		this.gravityPower = 10;

		//TIMEZONE
		this.timeZoneRadius = 300;
		this.timeZonefactor = 0.5;

		//BLACKHOLE
		this.blackHoleRadius = 10;
		this.blackHoleEffectRadius = 10;
		this.blackHoleForce = 60;

		//BLOCK
		this.blockSize = 100;
		
		this.startTime = Date.now();
		this.fieldEffectTimer = Math.random() * (this.maxTime - this.minTime) + this.minTime;
		this.effectContinuousTimer = Infinity;
		this.paddleTimer = Date.now();
		this.currentEffect = FieldEffect.NORMAL;
	}

	gameUpdate(server: Server){
		this.elapseTime = (Date.now() - this.startTime) / 1000;
		this.paddleElapseTime = (Date.now() - this.paddleTimer) / 1000;
		this.Ball.update();
		let score = this.Ball.checkContraint(this.canvasWidth, this.canvasHeight);
		if (score!=0){
			if (score == 1){
				this.player1Score++;
				this.lastWinner = "player1";
			}
			else{
				this.player2Score++;
				this.lastWinner = "player2";
			}
			this.resetTime = Date.now();
			this.gameReset = true;
		}
		
		if (this.elapseTime >= this.fieldEffectTimer){
			this.fieldChange(server);
			this.startTime = Date.now();
			this.fieldEffectTimer = Math.random() * (this.maxTime - this.minTime) + this.minTime;
			this.effectContinuousTimer = this.fieldEffectTimer - 2;
		}
		
		if (this.paddleElapseTime >= this.paddleResetTimer){
			this.paddleTimer = Date.now();
			this.resetGame(server);
		}

		if (this.elapseTime >= this.effectContinuousTimer){
			this.fieldReset(server);
		}
		if (this.circleObject != null){
			this.fieldEffect();
		}
		this.gameCollisionDetection();
	}

	gameCollisionDetection(){
		let result = null;
		if (this.Ball.posX > this.canvasWidth * 0.85){
			result = this.objectCollision(this.Ball, this.rightPaddle);
		}
		else if(this.Ball.posX < this.canvasWidth * 0.15){
			result = this.objectCollision(this.Ball, this.leftPaddle);
		}

		if (this.currentEffect == FieldEffect.BLOCK && this.blockObject != null){
			result = this.objectCollision(this.Ball, this.blockObject);
			this.Ball.impulsCollisionResponse(this.blockObject, result.normalX, result.normalY);
		}
		
		if (result && result.collided){
			this.paddleTimer = Date.now();
			this.Ball.collisionResponse(result.collideTime, result.normalX, result.normalY);
		}
	}

	/**
	 * Field effect function that run on every frame. Only used for time zone and black hole
	 */
	fieldEffect(){
		const BALL_CENTER_X = this.Ball.posX + this.Ball.width / 2;
		const BALL_CENTER_Y = this.Ball.posY + this.Ball.height / 2;
		if (this.currentEffect == FieldEffect.TIME_ZONE && this.circleObject != null){
			if (this.circleObject.checkInside(BALL_CENTER_X, BALL_CENTER_Y)){
				this.Ball.velX *= (this.effectMagnitude + this.timeZonefactor);
				this.Ball.velY *= (this.effectMagnitude + this.timeZonefactor);
			}
		}
		else if (this.currentEffect == FieldEffect.BLACK_HOLE && this.circleObject != null){
			this.circleObject.pull(this.Ball, this.blackHoleEffectRadius, this.blackHoleForce);
		}
		
	}

	fieldChange(server: Server){
		let effect = Math.floor(Math.random() * 5);
		let spawnPos;
		switch (effect){
			case FieldEffect.NORMAL:
				this.currentEffect = FieldEffect.NORMAL;
				server.emit("gameState", new FieldEffectDTO("NORMAL", 0,0,0));
				break;
			case FieldEffect.GRAVITY:
				console.log("gravity");
				let direction = Math.random();
				if (direction < 0.5){
					this.Ball.initAcceleration(0, this.gravityPower);
					this.effectMagnitude = 1;
					server.emit("gameState", new FieldEffectDTO("GRAVITY", 0,0,1));
				}
				else{
					this.Ball.initAcceleration(0, -this.gravityPower);
					this.effectMagnitude = -1;
					server.emit("gameState", new FieldEffectDTO("GRAVITY", 0,0,-1));
				}
				this.currentEffect = FieldEffect.GRAVITY;
				break;
			case FieldEffect.TIME_ZONE:
				spawnPos = this.getRandomSpawnPosition(this.timeZoneRadius);
				this.circleObject = new Circle(spawnPos.x, spawnPos.y, this.timeZoneRadius);
				let magnitude = Math.random();
				if (magnitude < 0.5){
					this.effectMagnitude = 1;
					server.emit("gameState", new FieldEffectDTO("TIME_ZONE", spawnPos.x, spawnPos.y, 1));
				}
				else{
					this.effectMagnitude = -1;
					server.emit("gameState", new FieldEffectDTO("TIME_ZONE", spawnPos.x, spawnPos.y, -1));
				}
				this.currentEffect = FieldEffect.TIME_ZONE;
				break;
			case FieldEffect.BLACK_HOLE:
				spawnPos = this.getRandomSpawnPosition(this.blackHoleRadius);
				this.circleObject = new Circle(spawnPos.x, spawnPos.y, this.blackHoleRadius);
				server.emit("gameState", new FieldEffectDTO("BLACK_HOLE", spawnPos.x, spawnPos.y, 0));
				this.currentEffect = FieldEffect.BLACK_HOLE;
				break;
			case FieldEffect.BLOCK:
				spawnPos = this.getRandomSpawnPosition(this.blockSize);
				this.blockObject = new Block(spawnPos.x, spawnPos.y, this.blockSize, this.blockSize, this.blockMass);
				server.emit("gameState", new FieldEffectDTO("BLOCK", spawnPos.x, spawnPos.y, 0));
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
		this.currentEffect = FieldEffect.NORMAL;
		this.Ball.initAcceleration(0,0);
		server.emit("gameState", new FieldEffectDTO("NORMAL", 0,0,0));
	}

	getBallQuadrant(){
		const xQuadrant = this.Ball.posX < this.canvasWidth / 2 ? 0 : 1;
		const yQuadrant = this.Ball.posY < this.canvasHeight / 2 ? 0 : 1;

		return xQuadrant + yQuadrant * 2;
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
		if (spawnQuadrant /2 == 0){
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

}