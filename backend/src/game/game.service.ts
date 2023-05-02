import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { GameDTO } from "src/dto/game.dto";
import { GameRoom } from "./entity/gameRoom";
import { GameSetting } from "./entity/settings";
import { Socket, Server } from "socket.io";


const LOBBY_LOGGING = true;

@Injectable()
export class GameService {
	constructor(private readonly userService: UserService) {}
	
	//Lobby variables
	private queues = {
		"standard": [],
		"power": [],
		"sudden": []
	};
	private ingame = [];
	
	private gameSettings : GameSetting = new GameSetting();
	private gameRooms = new Map<string, GameRoom>();


	//Lobby functions 
	async handleConnection(client: Socket) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined) {
			client.disconnect(true);
			return;
		}

		if (LOBBY_LOGGING)
			console.log(`${USER_DATA.intraName} connected as ${client.id}.`);

		// TODO: if player is ingame, reconnect player to game
	}

	async handleDisconnect(client: Socket) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return;

		Object.keys(this.queues).forEach(queueType => {
			if (this.queues[queueType].find(e => e.intraName === USER_DATA.intraName)) {
				this.queues[queueType] = this.queues[queueType].filter(function(e) { return e.intraName !== USER_DATA.intraName });

				if (LOBBY_LOGGING)
					console.log(`${USER_DATA.intraName} left ${queueType} queue due to disconnect.`);
			}
		});

		// TODO: if player is ingame, pause game and wait for reconnect, abandon game after x seconds
	}

	async joinQueue(client: Socket, clientQueue: string, server: Server) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return;

		// Check if queue is known
		if (!(clientQueue in this.queues)) {
			if (LOBBY_LOGGING)
				console.log(`${USER_DATA.intraName} tried to join unknown queue "${clientQueue}".`);
			client.emit('error', { error: 'unknown queue' });
			return;
		}

		// Check if player is already in a game
		if (this.ingame.find(e => e.intraName === USER_DATA.intraName)) {
			if (LOBBY_LOGGING)
				console.log(`${USER_DATA.intraName} is already in a game.`);
			client.emit('error', { error: 'already in game' });
			return;
		}

		// Check if player if already in a queue
		const IN_QUEUE = Object.keys(this.queues).find(queueType => {
			return (this.queues[queueType].find(e => e.intraName === USER_DATA.intraName))
		});
		if (IN_QUEUE !== undefined) {
			if (LOBBY_LOGGING)
				console.log(`${USER_DATA.intraName} is already in ${IN_QUEUE} queue.`);
			client.emit('error', { error: 'already in queue' });
			return;
		}

		// Puts player in the queue
		if (LOBBY_LOGGING)
			console.log(`${USER_DATA.intraName} joins ${clientQueue} queue.`);
		this.queues[clientQueue].push({intraName: USER_DATA.intraName, socket: client});
		
		// Run queue logic
		// TODO: right now it is FIFO, may want to change to be based on ELO.
		if (this.queues[clientQueue].length >= 2) {
			var player1 = this.queues[clientQueue].pop();
			this.ingame.push(player1);
			var player2 = this.queues[clientQueue].pop();
			this.ingame.push(player2);

			// this.startGame(player1, player2, server);
			if (LOBBY_LOGGING)
				console.log(`Game start ${player1.intraName} ${player2.intraName}`);
		}
	}

	async leaveQueue(client: Socket) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
			if (USER_DATA.error !== undefined)
				return;

		Object.keys(this.queues).forEach(queueType => {
			var hasPlayer = this.queues[queueType].find(e => e.intraName === USER_DATA.intraName);
			this.queues[queueType] = this.queues[queueType].filter(function(e) { return e.intraName !== USER_DATA.intraName });
			if (hasPlayer && LOBBY_LOGGING)
				console.log(`${USER_DATA.intraName} left ${queueType} queue.`);
		})
	}

	async joinGame(player1: Socket, player2: Socket, server: Server): Promise<string>{
		const ROOM = new GameRoom(player1.id, player2.id, this.gameSettings);
		// ROOM.generateRoomID();
		this.gameRooms.set(ROOM.roomID, ROOM);
		return (ROOM.roomID);
	}

	async startGame(roomID: string, server: Server){
		const ROOM = this.gameRooms.get(roomID);
		if (ROOM === undefined)
			return;
		await ROOM.run(server);
		this.gameRooms.delete(roomID);
	}

	// async startGame(player1: Socket, player2: Socket, server: Server){
	// 	// console.log(`Game start with ${player1.intraName} and ${player2.intraName}`);
	// 	// player1.socket.emit('game', `game start: opponent = ${player2.intraName}`);
	// 	// player2.socket.emit('game', `game start: opponent = ${player1.intraName}`);
	// 	//Leave lobby room

	// 	const ROOM = new GameRoom(player1.id, player2.id, this.gameSettings);
	// 	// ROOM.generateRoomID();
	// 	player1.join(ROOM.roomID);
	// 	player2.join(ROOM.roomID);
	// 	await ROOM.run(server);
	// 	console.log("game finish");

	// 	//Get both player info
	// 	// console.log(body.name);
	// 	// const TEST = this.userService.getUserDataByIntraName(body.name);
	// 	//Change both player status to in game
	// }

	async gameEnd(player1: any, player2: any){
		player1.leave(this.createGameRoom());
		player2.leave(this.createGameRoom());

		//TODO : send result to user service
		//TODO : remove users from ingame list
	}


	playerUpdate(socketId: string, value: number, roomID: string){
		
	}

	gameUpdate(){
		this.BALL.update();
		// this.BALL.accX = 1;
		// this.BALL.accY = 3;
		this.BALL.checkContraint(this.gameData.canvasWidth,this.gameData.canvasHeight);
		this.gameCollisionDetection();
		this.gameState.ballPosX = this.BALL.posX;
		this.gameState.ballPosY = this.BALL.posY;
		this.gameState.velX = this.BALL.velX;
		this.gameState.velY = this.BALL.velY;
		this.gameState.leftPaddlePosY = this.LEFT_PADDLE.posY + 50;
		this.gameState.rightPaddlePosY = this.RIGHT_PADDLE.posY + 50;
		console.log(this.BALL.posY, this.BALL.velY);
	}

	async gameLoop(server: any){
		this.resetGame();
		// await this.simpleCountdown(3);
		this.interval = setInterval(() => {
			const CURRENT_TIME = Date.now();
			if (this.lastTimeFrame != null){
				const DELTA_TIME = (CURRENT_TIME - this.lastTimeFrame);
				this.gameUpdate();
			}
			this.lastTimeFrame = CURRENT_TIME;
			server.emit('gameLoop', this.gameState);
		}, 1000/60);
	}

	gameCollisionDetection(){
		//Ball at right side of canvas, check right paddle
		if (this.BALL.posX > this.gameData.canvasWidth /2){
			this.ballCollisionDetection(this.BALL, this.RIGHT_PADDLE);
		}
		else{
			this.ballCollisionDetection(this.BALL, this.LEFT_PADDLE);
		}
	}

	//TODO : get the room id from client, used to sent the player update to correct room
	// getGameRoomID(client: Socket){
	// 	const ROOMS = client.rooms;
	// 	for (let room in ROOMS){
	// 		if (room != client.id){
	// 			return room;
	// 		}
	// 	}
	// 	return null;
	// }
}