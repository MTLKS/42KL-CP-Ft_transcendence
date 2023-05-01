import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GameDTO } from 'src/dto/game.dto';
import { Ball } from './entity/ball';
import { Paddle } from './entity/paddle';
import { Socket, Server } from 'socket.io';

interface GameData {
  player1_id: string;
  player2_id: string;
  canvasWidth: number;
  canvasHeight: number;
  lastWinner: string;
}

@Injectable()
export class GameService {
  constructor(private readonly userService: UserService) {}

  //Lobby variables
  queue = [];
  ingame = [];

  //Game logic parameters
  private gameState: GameDTO = {
    ballPosX: 0,
    ballPosY: 0,
    leftPaddlePosY: 0,
    rightPaddlePosY: 0,
    velX: 0,
    velY: 0,
  };

  private gameData: GameData = {
    player1_id: '',
    player2_id: '',
    canvasWidth: 1600,
    canvasHeight: 900,
    lastWinner: '',
  };

  private BALL = new Ball(
    this.gameState.ballPosX,
    this.gameState.ballPosY,
    10,
    10,
  );
  private LEFT_PADDLE = new Paddle(30, this.gameState.leftPaddlePosY, 15, 100);
  private RIGHT_PADDLE = new Paddle(
    this.gameData.canvasWidth - 30,
    this.gameState.rightPaddlePosY,
    15,
    100,
  );
  private interval: NodeJS.Timer | null = null;
  private lastTimeFrame: number | null = null;

  //Game config settings
  private BALL_SPEED_X = 0;
  private BALL_SPEED_Y = 5;

  //Lobby functions

  //TODO: generate unique id
  createGameRoom(): string {
    return 'room';
  }

  async joinQueue(client: Socket, server: Server) {
    const USER_DATA = await this.userService.getMyUserData(
      client.handshake.headers.authorization,
    );
    if (USER_DATA.error !== undefined) return;
    if (this.ingame.find((e) => e.intraName === USER_DATA.intraName)) {
      console.log(`${USER_DATA.intraName} is already in a game.`);
      client.emit('error', { error: 'already ingame' });
      return;
    }
    if (this.queue.find((e) => e.intraName === USER_DATA.intraName)) {
      console.log(`${USER_DATA.intraName} is already in the queue.`);
      client.emit('error', { error: 'already in queue' });
      return;
    }
    console.log(`${USER_DATA.intraName} joins queue as ${client.id}.`);
    this.queue.push({ intraName: USER_DATA.intraName, socket: client });
    console.log(this.queue);

    if (this.queue.length >= 2) {
      var player1 = this.queue.pop();
      this.ingame.push(player1);
      var player2 = this.queue.pop();
      this.ingame.push(player2);

      this.startGame(player1, player2, server);
    }
  }

  async leaveQueue(client: Socket) {
    const USER_DATA = await this.userService.getMyUserData(
      client.handshake.headers.authorization,
    );
    if (USER_DATA.error !== undefined) return;
    this.queue = this.queue.filter(function (e) {
      return e.intraName !== USER_DATA.intraName;
    });
    console.log(`${USER_DATA.intraName} left queue as ${client.id}.`);
    console.log(this.queue);
  }

  //Game functions

  async startGame(player1: any, player2: any, server: Server) {
    // console.log(`Game start with ${player1.intraName} and ${player2.intraName}`);
    // player1.socket.emit('game', `game start: opponent = ${player2.intraName}`);
    // player2.socket.emit('game', `game start: opponent = ${player1.intraName}`);
    // console.log(player1, player2);

    //Leave lobby room
    player1.join(this.createGameRoom());
    player2.join(this.createGameRoom());

    //Get both player info
    // console.log(body.name);
    // const TEST = this.userService.getUserDataByIntraName(body.name);
    //Change both player status to in game

    //Game Start
    // this.resetGame();
    // await this.simpleCountdown(3);
    if (this.interval == null) {
      this.gameLoop(server);
    }
  }

  async gameEnd(player1: any, player2: any) {
    player1.leave(this.createGameRoom());
    player2.leave(this.createGameRoom());

    //TODO : send result to user service
    //TODO : remove users from ingame list
  }

  /**
   * Reset the game state. Called when game first started or if one player score
   * 	Set the ball position to the center of the canvas
   * 	Set the ball velocity to 0
   * 	Check which player score and set ball velocity to the opposite side
   */
  resetGame() {
    this.BALL.posX = this.gameData.canvasWidth / 2;
    this.BALL.posY = this.gameData.canvasHeight / 2;
    if (this.gameData.lastWinner.length == 0) {
      this.BALL.velX =
        this.BALL_SPEED_X * (Math.round(Math.random()) === 0 ? -1 : 1);
      this.BALL.velY =
        this.BALL_SPEED_Y * (Math.round(Math.random()) === 0 ? -1 : 1);
    } else if (this.gameData.lastWinner == 'player1') {
      this.BALL.velX = this.BALL_SPEED_X;
      this.BALL.velY =
        this.BALL_SPEED_Y * (Math.round(Math.random()) === 0 ? -1 : 1);
    } else if (this.gameData.lastWinner == 'player2') {
      this.BALL.velX = -this.BALL_SPEED_X;
      this.BALL.velY =
        this.BALL_SPEED_Y * (Math.round(Math.random()) === 0 ? -1 : 1);
    }
  }

  playerUpdate(socketId: string, value: number) {
    this.LEFT_PADDLE.posY = value - 50;
    this.RIGHT_PADDLE.posY = value - 50;
    // if (socketId == this.gameData.player1_id){
    // 	this.gameState.leftPaddlePosY = value;
    // }
    // else if (socketId == this.gameData.player2_id){
    // 	this.gameState.rightPaddlePosY = value;
    // }
  }

  gameUpdate() {
    this.BALL.update();
    // this.BALL.accX = 1;
    // this.BALL.accY = 3;
    this.BALL.checkContraint(
      this.gameData.canvasWidth,
      this.gameData.canvasHeight,
    );
    this.gameCollisionDetection();
    this.gameState.ballPosX = this.BALL.posX;
    this.gameState.ballPosY = this.BALL.posY;
    this.gameState.velX = this.BALL.velX;
    this.gameState.velY = this.BALL.velY;
    this.gameState.leftPaddlePosY = this.LEFT_PADDLE.posY + 50;
    this.gameState.rightPaddlePosY = this.RIGHT_PADDLE.posY + 50;
    console.log(this.BALL.posY, this.BALL.velY);
  }

  async gameLoop(server: any) {
    this.resetGame();
    // await this.simpleCountdown(3);
    this.interval = setInterval(() => {
      const CURRENT_TIME = Date.now();
      if (this.lastTimeFrame != null) {
        const DELTA_TIME = CURRENT_TIME - this.lastTimeFrame;
        this.gameUpdate();
      }
      this.lastTimeFrame = CURRENT_TIME;
      server.emit('gameLoop', this.gameState);
    }, 1000 / 60);
  }

  //A simple countdown function, used to provide buffer time for both player to get ready
  async simpleCountdown(seconds: number): Promise<void> {
    let counter = seconds;
    while (counter >= 0) {
      counter--;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  ballCollisionDetection(ball: Ball, paddle: Paddle) {
    let xInvEntry, yInvEntry;
    let xInvExit, yInvExit;
    let xEntry, yEntry;
    let xExit, yExit;
    let entryTime, exitTime;

    if (ball.velX > 0) {
      xInvEntry = paddle.posX - (ball.posX + ball.width);
      xInvExit = paddle.posX + paddle.width - ball.posX;
    } else {
      xInvEntry = paddle.posX + paddle.width - ball.posX;
      xInvExit = paddle.posX - (ball.posX + ball.width);
    }
    if (ball.velY > 0) {
      yInvEntry = paddle.posY - (ball.posY + ball.height);
      yInvExit = paddle.posY + paddle.height - ball.posY;
    } else {
      yInvEntry = paddle.posY + paddle.height - ball.posY;
      yInvExit = paddle.posY - (ball.posY + ball.height);
    }

    if (ball.velX == 0) {
      xEntry = -Infinity;
      xExit = Infinity;
    } else {
      xEntry = xInvEntry / ball.velX;
      xExit = xInvExit / ball.velX;
    }
    if (ball.velY == 0) {
      yEntry = -Infinity;
      yExit = Infinity;
    } else {
      yEntry = yInvEntry / ball.velY;
      yExit = yInvExit / ball.velY;
    }

    entryTime = Math.max(xEntry, yEntry);
    exitTime = Math.min(xExit, yExit);

    if (
      entryTime > exitTime ||
      (xEntry < 0 && yEntry < 0) ||
      xEntry > 1 ||
      yEntry > 1
    ) {
      return;
    } else {
      let normalX = 0;
      let normalY = 0;
      if (xEntry > yEntry) {
        if (xInvEntry < 0) {
          normalX = 1;
        } else {
          normalX = -1;
        }
      } else {
        if (yInvEntry < 0) {
          normalY = 1;
        } else {
          normalY = -1;
        }
      }
      this.BALL.collisionResponse(entryTime, normalX, normalY);
    }
  }

  gameCollisionDetection() {
    //Ball at right side of canvas, check right paddle
    if (this.BALL.posX > this.gameData.canvasWidth / 2) {
      this.ballCollisionDetection(this.BALL, this.RIGHT_PADDLE);
    } else {
      this.ballCollisionDetection(this.BALL, this.LEFT_PADDLE);
    }
  }
}
