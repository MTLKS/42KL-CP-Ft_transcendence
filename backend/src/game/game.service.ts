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

export enum PowerUp{
  NORMAL = 0,
  SPEED,
  SIZE,
  PRECISION,
  SPIN
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
    if (!(clientQueue in this.queues)) {
      if (LOBBY_LOGGING)
        console.log(
          `${USER_DATA.intraName} tried to join unknown queue "${clientQueue}".`,
        );
      client.emit(
        'gameResponse',
        new GameResponseDTO('error', 'unknown queue'),
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
          new GameResponseDTO('error', 'already in game'),
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
        new GameResponseDTO('error', 'already in queue'),
      );
      return;
    }

    // Puts player in the queue
    if (LOBBY_LOGGING)
      console.log(`${USER_DATA.intraName} joins ${clientQueue} queue.`);
    let player = new Player(USER_DATA.intraName, ACESS_TOKEN, client);
    client.emit(
      'gameResponse',
      new GameResponseDTO('success', `joined queue ${clientQueue}`),
    );

    // Run queue logic
    for (let i = 0; i < this.queues[clientQueue].length; i++) {
      const OTHER_USER_DATA = await this.userService.getUserDataByIntraName(player.accessToken, this.queues[clientQueue][i].intraName);
      console.log(OTHER_USER_DATA.intraName, OTHER_USER_DATA.elo);
      if (OTHER_USER_DATA.error !== undefined || Math.abs(OTHER_USER_DATA.elo - USER_DATA.elo) > 100)
        continue;

      let otherPlayer = this.queues[clientQueue][i];
      this.queues[clientQueue].splice(i, 1);
      if (LOBBY_LOGGING)
        console.log(`Game start ${otherPlayer.intraName} ${player.intraName}`);
      if (clientQueue === "standard")
        this.joinLobby(otherPlayer, player, clientQueue);
      else
        this.joinGame(otherPlayer, player, clientQueue, server);
      return;
    }
    this.queues[clientQueue].push(player);

    //TESTING
    // var player1 = this.queues[clientQueue].pop();
    // this.ingame.push(player1);
    // this.joinGame(player1, player1, clientQueue, server);
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
          new GameResponseDTO('success', `left queue ${queueType}`),
        );
        if (LOBBY_LOGGING)
          console.log(`${USER_DATA.intraName} left ${queueType} queue.`);
      }
    });
  }

  joinLobby(player1: Player, player2: Player, gameType: string) {
    let lobby = new Lobby(player1, player2, gameType);
    this.gameLobbies.set(player1.intraName + player2.intraName, lobby);
    player1.socket.emit('gameState', new GameStateDTO('LobbyStart', new LobbyStartDTO(player1.intraName, player2.intraName)));
    player2.socket.emit('gameState', new GameStateDTO('LobbyStart', new LobbyStartDTO(player1.intraName, player2.intraName)));
  }

  async handleReady(client: Socket, powerUp: string, server: Server) {
    const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
    if (USER_DATA.error !== undefined) return;

    this.gameLobbies.forEach((gameLobby, key) => {
      if (gameLobby.player1.intraName === USER_DATA.intraName) {
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
        this.joinGame(gameLobby.player1, gameLobby.player2, "standard", server, gameLobby.player1PowerUp, gameLobby.player2PowerUp);
        this.gameLobbies.delete(key);
      }
    });
  }

  async joinGame(player1: Player, player2: Player, gameType: string, server: Server, player1PowerUp?: string, player2PowerUp?: string): Promise<string> {
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
        this.matchService,
        this.userService,
        PowerUp.SPIN,
        PowerUp.NORMAL,
        // PowerUp.SPEED,//TODO: change
        // PowerUp.SPEED,//TODO: change
      );
    } else {
      const ROOM_SETTING = new GameSetting(100, 100, GameMode.DEATH, 1);
      room = new DeathGameRoom(player1, player2, gameType, ROOM_SETTING, this.matchService, this.userService);
    }
    player1.socket.join(room.roomID);
    player2.socket.join(room.roomID);
    player1.socket.emit('gameState', new GameStateDTO('GameStart', new GameStartDTO(player2.intraName, gameType, true, room.roomID)));
    player2.socket.emit('gameState', new GameStateDTO('GameStart', new GameStartDTO(player1.intraName, gameType, false, room.roomID)));
    this.gameRooms.set(room.roomID, room);
    await room.run(server);
    return room.roomID;
  }

  async startGame(roomID: string, server: Server) {
    const ROOM = this.gameRooms.get(roomID);
    if (ROOM === undefined) return;
    await ROOM.run(server);
  }

  async playerUpdate(client: Socket, roomID: string, value: number) {
    const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
    if (USER_DATA.error !== undefined) return;
    const ROOM = this.gameRooms.get(roomID);
    if (ROOM === undefined) return;
    ROOM.updatePlayerPos(client.id, value);
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
