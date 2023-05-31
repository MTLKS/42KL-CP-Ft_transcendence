import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GameRoom } from './entity/gameRoom';
import { PowerGameRoom } from './entity/powerGameRoom';
import { GameSetting, GameMode } from './entity/gameSetting';
import { Socket, Server } from 'socket.io';
import { Player } from './entity/player';
import { GameResponseDTO } from 'src/dto/gameResponse.dto';
import {
  GameStateDTO,
  GameStartDTO,
  GameEndDTO,
  GamePauseDTO,
  LobbyStartDTO,
} from 'src/dto/gameState.dto';
import { MatchService } from 'src/match/match.service';
import { DeathGameRoom } from './entity/deathGameRoom';
import { Lobby } from './entity/lobby';
import { PracticeGameRoom } from './entity/practiceGameRoom';

export enum PowerUp{
  NORMAL = 0,
  SPEED = 1,
  SIZE = 2,
  PRECISION = 3,
  SPIN = 4,
}

const LOBBY_LOGGING = false;

@Injectable()
export class GameService {
  constructor(
    private readonly userService: UserService,
    private readonly matchService: MatchService,
  ) {}

  //Lobby variables
  private queues = {
    boring: [],
    standard: [],
    death: [],
  };
  private connected = [];

  private gameRooms = new Map<string, GameRoom>();
  private gameLobbies = new Map<string, Lobby>();

  //Lobby functions
  async handleConnection(client: Socket) {
    const ACCESS_TOKEN = client.handshake.headers.authorization;
    const USER_DATA = await this.userService.getMyUserData(ACCESS_TOKEN);
    if (USER_DATA.error !== undefined) {
      // client.disconnect(true);
      return;
    }

    // Checks if user is already connected, if they are then send error and disconnect
    if (
      this.connected.find((e: Player) => e.intraName === USER_DATA.intraName)
    ) {
      client.emit(
        'gameResponse',
        new GameResponseDTO('error', 'already connected'),
      );
      client.disconnect(true);
      return;
    }

    // Keeps track of users that are connected
    let player = new Player(USER_DATA.intraName, ACCESS_TOKEN, client);
    this.connected.push(player);

    // Clear any ended game rooms
    this.clearGameRooms();

    // If player is ingame, reconnect player to game
    this.gameRooms.forEach((gameRoom) => {
      if (gameRoom._players.includes(USER_DATA.intraName)) {
        gameRoom.resumeGame(player);
      }
    });
  }

  async handleDisconnect(server: Server, client: Socket) {
    const USER_DATA = await this.userService.getMyUserData(
      client.handshake.headers.authorization,
    );
    if (USER_DATA.error !== undefined) return;

    Object.keys(this.queues).forEach((queueType) => {
      if (
        this.queues[queueType].find(
          (e: Player) =>
            e.intraName === USER_DATA.intraName && e.socket.id === client.id,
        )
      ) {
        this.queues[queueType] = this.queues[queueType].filter(function (e) {
          return e.intraName !== USER_DATA.intraName;
        });

        if (LOBBY_LOGGING)
          console.log(
            `${USER_DATA.intraName} left ${queueType} queue due to disconnect.`,
          );
      }
    });

    // If player is ingame, pause game
    this.gameRooms.forEach((gameRoom) => {
      if (gameRoom._players.includes(USER_DATA.intraName)) {
        gameRoom.togglePause(server, USER_DATA.intraName);
      }
    });

    // Removes user from connection tracking
    this.connected = this.connected.filter(function (e) {
      return e.intraName !== USER_DATA.intraName || e.socket.id !== client.id;
    });
  }

  async joinQueue(client: Socket, clientQueue: string, server: Server) {
    const ACESS_TOKEN = client.handshake.headers.authorization;
    const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
    if (USER_DATA.error !== undefined) return;

    // Check if queue is known
    if (!(clientQueue in this.queues) && clientQueue !== "practice") {
      if (LOBBY_LOGGING)
        console.log(
          `${USER_DATA.intraName} tried to join unknown queue "${clientQueue}".`,
        );
      client.emit(
        'gameResponse',
        new GameResponseDTO('error', 'Unknown queue: ' + clientQueue),
      );
      return;
    }

    // Clear any ended game rooms
    this.clearGameRooms();

    // Check if player is already in a game
    this.gameRooms.forEach((gameRoom) => {
      if (gameRoom._players.includes(USER_DATA.intraName)) {
        if (LOBBY_LOGGING)
          console.log(`${USER_DATA.intraName} is already in a game.`);
        client.emit(
          'gameResponse',
          new GameResponseDTO('error', 'Already in game'),
        );
        return;
      }
    });

    // Check if player if already in a queue
    const IN_QUEUE = Object.keys(this.queues).find((queueType) => {
      return this.queues[queueType].find(
        (e) => e.intraName === USER_DATA.intraName,
      );
    });
    if (IN_QUEUE !== undefined) {
      if (LOBBY_LOGGING)
        console.log(`${USER_DATA.intraName} is already in ${IN_QUEUE} queue.`);
      client.emit(
        'gameResponse',
        new GameResponseDTO('error', 'Already in queue'),
      );
      return;
    }

    if (clientQueue === "practice") {
      let player = new Player(USER_DATA.intraName, ACESS_TOKEN, client);
      this.joinPractice(server, player);
      return;
    }

    // Puts player in the queue
    if (LOBBY_LOGGING)
      console.log(`${USER_DATA.intraName} joins ${clientQueue} queue.`);
    let player = new Player(USER_DATA.intraName, ACESS_TOKEN, client);
    client.emit(
      'gameResponse',
      new GameResponseDTO('success', `Joined ${clientQueue} queue`),
    );

    // Run queue logic
    for (let i = 0; i < this.queues[clientQueue].length; i++) {
      const OTHER_USER_DATA = await this.userService.getUserDataByIntraName(player.accessToken, this.queues[clientQueue][i].intraName);
      console.log(OTHER_USER_DATA.intraName, OTHER_USER_DATA.elo);
      if (OTHER_USER_DATA.error !== undefined)
        continue;

      let otherPlayer = this.queues[clientQueue][i];
      this.queues[clientQueue].splice(i, 1);
      if (LOBBY_LOGGING)
        console.log(`Game start ${otherPlayer.intraName} ${player.intraName}`);
      this.joinLobby(otherPlayer, player, clientQueue);
      return;
    }
    this.queues[clientQueue].push(player);
    //TESTING
    var player1 = this.queues[clientQueue].pop();
    // this.ingame.push(player1);
    this.joinGame(player1, player1, clientQueue, server, PowerUp.PRECISION, PowerUp.PRECISION);
  }

  async leaveQueue(client: Socket) {
    const USER_DATA = await this.userService.getMyUserData(
      client.handshake.headers.authorization,
    );
    if (USER_DATA.error !== undefined) return;

    Object.keys(this.queues).forEach((queueType) => {
      if (
        this.queues[queueType].find((e) => e.intraName === USER_DATA.intraName)
      ) {
        this.queues[queueType] = this.queues[queueType].filter(function (e) {
          return e.intraName !== USER_DATA.intraName;
        });
        client.emit(
          'gameResponse',
          new GameResponseDTO('success', `Left the ${queueType} queue`),
        );
        if (LOBBY_LOGGING)
          console.log(`${USER_DATA.intraName} left ${queueType} queue.`);
      }
    });
  }

  joinLobby(player1: Player, player2: Player, gameType: string) {
    let lobby = new Lobby(player1, player2, gameType);
    this.gameLobbies.set(player1.intraName + player2.intraName, lobby);
    player1.socket.emit('gameState', new GameStateDTO('LobbyStart', new LobbyStartDTO(player1.intraName, player2.intraName, gameType)));
    player2.socket.emit('gameState', new GameStateDTO('LobbyStart', new LobbyStartDTO(player1.intraName, player2.intraName, gameType)));
  }

  getPowerUp(powerUpString: string): PowerUp {
    let powerUp: PowerUp;
    powerUpString = powerUpString.toLowerCase();
    if (powerUpString === "normal")
      powerUp = PowerUp.NORMAL;
    else if (powerUpString === "speed" || powerUpString === "vzzzzzzt")
      powerUp = PowerUp.SPEED;
    else if (powerUpString === "precision" || powerUpString === "piiuuuuu")
      powerUp = PowerUp.PRECISION;
    else if (powerUpString === "size" || powerUpString === "ngeeeaat")
      powerUp = PowerUp.SIZE;
    else if (powerUpString === "spin" || powerUpString === "vrooooom")
      powerUp = PowerUp.SPIN;
    else
      powerUp = null;
    return powerUp;
  }

  async handleReady(client: Socket, powerUp: string, server: Server) {
    const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
    if (USER_DATA.error !== undefined) return;
    console.log(powerUp);
    if (this.getPowerUp(powerUp) === null) return;

    this.gameLobbies.forEach((gameLobby, key) => {
      let gameType;
      if (gameLobby.player1.intraName === USER_DATA.intraName) {
        gameType= gameLobby.gameType;
        gameLobby.player1Ready = true;
        gameLobby.player1PowerUp = powerUp;
        if (LOBBY_LOGGING)
          console.log(`${USER_DATA.intraName} is ready.`);
      } else {
        gameLobby.player2Ready = true;
        gameLobby.player2PowerUp = powerUp;
        if (LOBBY_LOGGING)
        console.log(`${USER_DATA.intraName} is ready.`);
      }
      if (gameLobby.player1Ready && gameLobby.player2Ready)
      {
        this.joinGame(gameLobby.player1, gameLobby.player2, gameType, server, this.getPowerUp(gameLobby.player1PowerUp), this.getPowerUp(gameLobby.player2PowerUp));
        this.gameLobbies.delete(key);
      }
    });
  }

  async joinPractice(server: Server, player: Player) {
    let room = new PracticeGameRoom(player, PowerUp.SPIN);
    player.socket.join(room.roomID);
    player.socket.emit('gameState', new GameStateDTO('GameStart', new GameStartDTO("Bot", "standard", true, room.roomID)));
    this.gameRooms.set(room.roomID, room);
    await room.run(server);
  }

  async joinGame(player1: Player, player2: Player, gameType: string, server: Server, player1PowerUp?: PowerUp, player2PowerUp?: PowerUp): Promise<string> {
    let room;
    if (gameType === 'boring') {
      const ROOM_SETTING = new GameSetting(100, 100, GameMode.BORING);
      room = new GameRoom(player1, player2, gameType, ROOM_SETTING, this.matchService, this.userService);
    } else if (gameType === 'standard') {
      const ROOM_SETTING = new GameSetting(100, 100, GameMode.STANDARD);
      room = new PowerGameRoom(
        player1,
        player2,
        gameType,
        ROOM_SETTING,
        player1PowerUp,
        player2PowerUp,
        // PowerUp.SPEED,
        // PowerUp.NORMAL,
        this.matchService,
        this.userService,
      );
    } else {
      const ROOM_SETTING = new GameSetting(100, 100, GameMode.DEATH, 1);
      room = new DeathGameRoom(player1, player2, gameType, ROOM_SETTING, this.matchService, this.userService);
    }
    player1.socket.join(room.roomID);
    player2.socket.join(room.roomID);
    player1.socket.emit('gameState', new GameStateDTO('GameStart', new GameStartDTO(player2.intraName, gameType, true, room.roomID, player1PowerUp, player2PowerUp)));
    player2.socket.emit('gameState', new GameStateDTO('GameStart', new GameStartDTO(player1.intraName, gameType, false, room.roomID, player1PowerUp, player2PowerUp)));
    this.gameRooms.set(room.roomID, room);
    await room.run(server);
    return room.roomID;
  }

  async startGame(roomID: string, server: Server) {
    const ROOM = this.gameRooms.get(roomID);
    if (ROOM === undefined) return;
    await ROOM.run(server);
  }

  async playerUpdate(client: Socket, roomID: string, xValue: number, yValue: number) {
    const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
    if (USER_DATA.error !== undefined) return;
    const ROOM = this.gameRooms.get(roomID);
    if (ROOM === undefined) return;
    ROOM.updatePlayerPos(client.id, xValue, yValue);
  }

  async playerMouseUpdate(client: Socket, roomID: string, isMouseDown: boolean) {
    const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
    if (USER_DATA.error !== undefined) return;
    const ROOM = this.gameRooms.get(roomID);
    if (ROOM === undefined) return;
    ROOM.updatePlayerMouse(client.id, isMouseDown);
  }

  clearGameRooms() {
    this.gameRooms.forEach((gameRoom, key) => {
      if (gameRoom.gameEnded) {
        this.gameRooms.delete(key);
        if (LOBBY_LOGGING) console.log(`game room ${key} has been deleted.`);
      }
    });
  }
}
