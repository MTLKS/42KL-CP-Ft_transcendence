import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { GameRoom } from "./entity/gameRoom";
import { GameSetting, GameMode } from "./entity/gameSetting";
import { Socket, Server } from "socket.io";
import { Player } from "./entity/player";
import { GameResponseDTO } from "src/dto/gameResponse.dto";
import { GameStateDTO, GameStartDTO, GameEndDTO, GamePauseDTO } from "src/dto/gameState.dto";

//TODO : "gameState" event-> game start, game end, field effect

const LOBBY_LOGGING = false;

@Injectable()
export class GameService {
	constructor(
		private readonly userService: UserService, )
		{}
	
	//Lobby variables
	private queues = {
		"standard": [],
		"power": [],
		"sudden": []
	};
	private ingame = [];
	private connected = [];

	private gameRooms = new Map<string, GameRoom>();

	//Lobby functions 
	async handleConnection(client: Socket) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined) {
			// client.disconnect(true);
			return;
		}

		// Checks if user is already connected, if they are then send error and disconnect
		if (this.connected.find((e: Player) => e.intraName === USER_DATA.intraName)) {
			client.emit('gameResponse', new GameResponseDTO('error', 'already connected'));
			client.disconnect(true);
			return;
		}

		// Keeps track of users that are connected
		let player = new Player(USER_DATA.intraName, client);
		this.connected.push(player);

		if (LOBBY_LOGGING)
			console.log(`${USER_DATA.intraName} connected as ${client.id}.`);

		// If player is ingame, reconnect player to game
		this.gameRooms.forEach((gameRoom) => {
			if (gameRoom._players.includes(USER_DATA.intraName)) {
				gameRoom.resumeGame(player);
			}
		})
	}

	async handleDisconnect(client: Socket) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return;

		Object.keys(this.queues).forEach(queueType => {
			if (this.queues[queueType].find((e: Player) => e.intraName === USER_DATA.intraName && e.socket.id === client.id)) {
				this.queues[queueType] = this.queues[queueType].filter(function(e) { return e.intraName !== USER_DATA.intraName });

				if (LOBBY_LOGGING)
					console.log(`${USER_DATA.intraName} left ${queueType} queue due to disconnect.`);
			}
		});

		// If player is ingame, pause game 
		this.gameRooms.forEach((gameRoom) => {
			if (gameRoom._players.includes(USER_DATA.intraName)) {
				gameRoom.togglePause();
			}
		})

		// Removes user from connection tracking
		this.connected = this.connected.filter(function(e) { return e.intraName !== USER_DATA.intraName || e.socket.id !== client.id});
		
		if (LOBBY_LOGGING)
			console.log(`${USER_DATA.intraName} disconnected from ${client.id}.`);
	}

	async joinQueue(client: Socket, clientQueue: string, server: Server) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return;

		// Check if queue is known
		if (!(clientQueue in this.queues)) {
			if (LOBBY_LOGGING)
				console.log(`${USER_DATA.intraName} tried to join unknown queue "${clientQueue}".`);
			client.emit('gameResponse', new GameResponseDTO('error', 'unknown queue'));
			return;
		}

		// Check if player is already in a game
		if (this.ingame.find(e => e.intraName === USER_DATA.intraName)) {
			if (LOBBY_LOGGING)
				console.log(`${USER_DATA.intraName} is already in a game.`);
			client.emit('gameResponse', new GameResponseDTO('error', 'already in game'));
			return;
		}

		// Check if player if already in a queue
		const IN_QUEUE = Object.keys(this.queues).find(queueType => {
			return (this.queues[queueType].find(e => e.intraName === USER_DATA.intraName))
		});
		if (IN_QUEUE !== undefined) {
			if (LOBBY_LOGGING)
				console.log(`${USER_DATA.intraName} is already in ${IN_QUEUE} queue.`);
			client.emit('gameResponse', new GameResponseDTO('error', 'already in queue'));
			return;
		}

		// Puts player in the queue
		if (LOBBY_LOGGING)
			console.log(`${USER_DATA.intraName} joins ${clientQueue} queue.`);
		let player = new Player(USER_DATA.intraName, client);
		this.queues[clientQueue].push(player);
		client.emit('gameResponse', new GameResponseDTO('success', `joined queue ${clientQueue}`));
		
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
			this.joinGame(player1, player2, clientQueue, server);
		}

		//TESTING
		var player1 = this.queues[clientQueue].pop();
		this.ingame.push(player1);
		this.joinGame(player1, player1, clientQueue, server);
	}

	async leaveQueue(client: Socket) {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
			if (USER_DATA.error !== undefined)
				return;

		Object.keys(this.queues).forEach(queueType => {
			if (this.queues[queueType].find(e => e.intraName === USER_DATA.intraName)) {
				this.queues[queueType] = this.queues[queueType].filter(function(e) { return e.intraName !== USER_DATA.intraName });
				client.emit('gameResponse', new GameResponseDTO('success', `left queue ${queueType}`));
				if (LOBBY_LOGGING)
					console.log(`${USER_DATA.intraName} left ${queueType} queue.`);
			}
		})
	}

	async joinGame(player1: Player, player2: Player, gameType: string, server: Server): Promise<string>{
		const ROOM_SETTING = new GameSetting(100,100,GameMode.STANDARD);
		const ROOM = new GameRoom(player1, player2, gameType, ROOM_SETTING);
		player1.socket.join(ROOM.roomID);
		player2.socket.join(ROOM.roomID);
		player1.socket.emit('gameState', new GameStateDTO("GameStart", new GameStartDTO(player2.intraName, gameType, true, ROOM.roomID)));
		player2.socket.emit('gameState', new GameStateDTO("GameStart", new GameStartDTO(player1.intraName, gameType, false, ROOM.roomID)));
		server.to(ROOM.roomID).emit('gameState', { type: "GameStart", data: ROOM.roomID});
		this.gameRooms.set(ROOM.roomID, ROOM);
		await ROOM.run(server);
		return (ROOM.roomID);
	}

	async startGame(roomID: string, server: Server){
		const ROOM = this.gameRooms.get(roomID);
		if (ROOM === undefined)
			return;
		await ROOM.run(server);
	}

	async playerUpdate(client: Socket, roomID: string, value: number){
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return;
		const ROOM = this.gameRooms.get(roomID);
		if (ROOM === undefined)
			return;
		ROOM.updatePlayerPos(client.id, value);
	}
}
