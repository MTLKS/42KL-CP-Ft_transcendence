import SocketApi from "../api/socketApi";
import { GameDTO } from "../model/GameDTO";
import { GameResponseDTO } from "../model/GameResponseDTO";
import {
  GameStateDTO,
  GameStartDTO,
  GameEndDTO,
  GamePauseDTO,
  FieldEffectDTO,
} from "../model/GameStateDTO";
import { Offset } from "../model/GameModels";
import { clamp } from "lodash";
import GameEntity, {
  GameBlackhole,
  GameBlock,
  GameTimeZone,
} from "../model/GameEntities";
import sleep from "../functions/sleep";
import GameParticle from "../model/GameParticle";
import * as PIXI from "pixi.js";

export enum PaddleType {
  "Vzzzzzzt",
  "Piiuuuuu",
  "Ngeeeaat",
  "Vrooooom",
  "boring",
}

export class GameData {
  socketApi: SocketApi;

  // game display settings
  useParticlesFilter: boolean = false;
  useEntitiesFilter: boolean = true;
  usePaddleFilter: boolean = true;
  useHitFilter: boolean = true;
  tickPerParticlesSpawn: number = 0;
  gameMaxWidth: number = 1600;
  gameMaxHeight: number = 900;
  gameCurrentWidth: number = 1600;
  gameCurrentHeight: number = 900;

  // pong variables
  private _pongPosition: Offset = { x: 800, y: 450 };
  private _pongSpeed: Offset = { x: 12, y: 8 };
  pongSpin: number = 2;

  // player related variables
  leftPaddlePosition: Offset = { x: -50, y: 450 };
  rightPaddlePosition: Offset = { x: 1650, y: 450 };
  leftPaddleType: PaddleType = PaddleType.boring;
  rightPaddleType: PaddleType = PaddleType.boring;
  isLeft: boolean = true;
  player1Score: number = 0;
  player2Score: number = 0;

  // game state related variables
  usingLocalTick: boolean = false;
  localTicker: PIXI.Ticker | undefined = undefined;
  gameDisplayed: boolean = false;
  gameStarted: boolean = false;
  gameRoom: string = "";
  gameType: "boring" | "standard" | "death" | "" = "";
  gameEntities: GameEntity[] = [];
  inFocus: boolean = true;

  // global effects
  globalSpeedFactor: number = 1;
  globalScaleFactor: number = 1;
  globalGravityX: number = 0;
  globalGravityY: number = 0;

  blockPosition: Offset = { x: -500, y: -500 };

  setScale?: (scale: number) => void;
  setUsingTicker?: (usingTicker: boolean) => void;
  setShouldRender?: (shouldRender: boolean) => void;
  setShouldDisplayGame?: (shouldDisplayGame: boolean) => void;
  setEntities?: (entities: GameEntity[]) => void;
  private sendPlayerMove?: (y: number, x: number, gameRoom: string) => void;
  private sendPlayerClick?: (isMouseDown: boolean, gameRoom: string) => void;

  resize?: () => void;
  focus?: () => void;
  blur?: () => void;

  constructor() {
    this.socketApi = new SocketApi("game");
    this.socketApi.listen("gameLoop", this.listenToGameLoopCallBack);
    this.socketApi.listen("gameState", this.listenToGameState);
    this.socketApi.listen("gameResponse", this.listenToGameResponse);
    this.sendPlayerMove = (y: number, x: number, gameRoom: string) => {
      this.socketApi.sendMessages("playerMove", {
        gameRoom: gameRoom,
        y: y,
        x: x,
      });
    };
    this.sendPlayerClick = (isMouseDown: boolean, gameRoom: string) => {
      this.socketApi.sendMessages("playerClick", {
        gameRoom: gameRoom,
        isMouseDown: isMouseDown,
      });
    };
  }

  get pongPosition() {
    return { ...this._pongPosition } as Readonly<Offset>;
  }

  get pongSpeed() {
    return { ...this._pongSpeed } as Readonly<Offset>;
  }

  async joinQueue(queueType: string): Promise<GameResponseDTO> {
    this.socketApi.sendMessages("joinQueue", { queue: queueType });
    return new Promise((resolve) => {
      this.socketApi.socket.on("gameResponse", (event) => {
        resolve(event);
      });
    });
  }

  async leaveQueue(): Promise<GameResponseDTO> {
    this.socketApi.sendMessages("leaveQueue", {});
    return new Promise((resolve) => {
      this.socketApi.socket.on("gameResponse", (event) => {
        resolve(event);
      });
    });
  }

  startGame() {
    if (this.gameStarted) {
      console.error("game already started");
      return;
    }
    console.log("start game");
    this.gameStarted = true;
    this.disableLocalTick();
    if (this.setShouldRender) this.setShouldRender?.(true);
  }

  displayGame() {
    if (this.gameDisplayed) {
      console.error("game already displayed");
      return;
    }
    const canvas = document.getElementById("pixi") as HTMLCanvasElement;
    canvas.style.display = "block";
    this.resize = () => {
      const aspectRatio = 16 / 9;
      const clampedWidth = clamp(window.innerWidth, 0, this.gameMaxWidth);
      const clampedHeight = clamp(window.innerHeight, 0, this.gameMaxHeight);
      const newWidth = Math.min(clampedWidth, clampedHeight * aspectRatio);
      const newHeight = Math.min(clampedHeight, clampedWidth / aspectRatio);
      const newTop = (window.innerHeight - newHeight) / 2;
      const newLeft = (window.innerWidth - newWidth) / 2;
      this.gameCurrentWidth = newWidth;
      this.gameCurrentHeight = newHeight;
      document.documentElement.style.setProperty("--canvas-top", `${newTop}px`);
      document.documentElement.style.setProperty(
        "--canvas-left",
        `${newLeft}px`
      );
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.style.width = newWidth + "px";
      canvas.style.height = newHeight + "px";
      if (this.setScale) this.setScale(newWidth / 1600);
    };
    this.focus = async () => {
      this.inFocus = true;
      this.setUsingTicker?.(true);
      for (let i = 0; i < 20; i++) {
        if (!this.inFocus) return;
        this.globalSpeedFactor += 0.05;
        this.globalScaleFactor += 0.02;
        await sleep(50);
      }
      this.globalSpeedFactor = 1;
      this.globalScaleFactor = 1;
    };
    this.blur = async () => {
      this.inFocus = false;
      for (let i = 0; i < 20; i++) {
        if (this.inFocus) return;
        this.globalSpeedFactor -= 0.05;
        this.globalScaleFactor -= 0.02;
        await sleep(50);
      }
      this.setUsingTicker?.(false);
    };
    window.addEventListener("resize", this.resize);
    window.addEventListener("focus", this.focus);
    window.addEventListener("blur", this.blur);
    this.resize();
    this.gameDisplayed = true;
    if (this.setShouldDisplayGame) this.setShouldDisplayGame?.(true);
  }

  stopDisplayGame() {
    if (!this.gameDisplayed) {
      console.error("game already stopped displaying");
      return;
    }
    const canvas = document.getElementById("pixi") as HTMLCanvasElement;
    canvas.style.display = "none";
    window.removeEventListener("resize", this.resize!);
    window.removeEventListener("focus", this.focus!);
    window.removeEventListener("blur", this.blur!);
    this.gameDisplayed = false;
  }

  async endGame() {
    console.log("end game");
    if (!this.gameStarted) return;
    await sleep(3000);
    this.stopDisplayGame();
    this.gameStarted = false;
    this.setShouldRender?.(false);
    this._resetVariables();
    if (this.setShouldDisplayGame) this.setShouldDisplayGame?.(false);
  }

  private _resetVariables() {
    this.gameType = "";
    this.leftPaddlePosition = { x: -50, y: 450 };
    this.rightPaddlePosition = { x: 1650, y: 450 };
    this.leftPaddleType = PaddleType.boring;
    this.rightPaddleType = PaddleType.boring;

    this.globalGravityX = 0;
    this.globalGravityY = 0;
    this.globalSpeedFactor = 1;
    this.globalScaleFactor = 1;
    this.gameEntities = [];
  }

  set setSetScale(setScale: (scale: number) => void) {
    this.setScale = setScale;
  }

  set setSetShouldRender(setShouldRender: (shouldRender: boolean) => void) {
    this.setShouldRender = setShouldRender;
  }

  set setSetShouldDisplayGame(
    setShouldDisplayGame: (startMatch: boolean) => void
  ) {
    this.setShouldDisplayGame = setShouldDisplayGame;
  }

  set setSetUsingTicker(setUsingTicker: (usingTicker: boolean) => void) {
    this.setUsingTicker = setUsingTicker;
  }

  set setSetEntities(setEntities: (entities: GameEntity[]) => void) {
    this.setEntities = setEntities;
  }

  listenToGameState = (state: GameStateDTO) => {
    console.log(state);
    switch (state.type) {
      case "GameStart":
        this.isLeft = (<GameStartDTO>state.data).isLeft;
        this.gameRoom = (<GameStartDTO>state.data).gameRoom;
        this.gameType = (<GameStartDTO>state.data).gameType;
        this.startGame();
        this.displayGame();
        break;
      case "GameEnd":
        this.endGame();
        this.disableLocalTick();
        break;
      case "FieldEffect":
        const fieldEffect = <FieldEffectDTO>state.data;
        this.gameEntities.length = 0;
        this.globalGravityX = 0;
        this.globalGravityY = 0;
        switch (fieldEffect.type) {
          case "NORMAL":
            this.gameEntities = [];
            break;
          case "GRAVITY":
            this.globalGravityX = 0;
            this.globalGravityY =
              (fieldEffect.magnitude * 2) /
              Math.sqrt(this.pongSpeed.x ** 2 + this.pongSpeed.y ** 2);
            break;
          case "TIME_ZONE":
            this.gameEntities = [
              new GameTimeZone(
                { x: fieldEffect.xPos, y: fieldEffect.yPos, w: 500, h: 500 },
                fieldEffect.magnitude
              ),
            ];
            break;
          case "BLACK_HOLE":
            this.gameEntities = [
              new GameBlackhole(
                { x: fieldEffect.xPos, y: fieldEffect.yPos, w: 100, h: 100 },
                2
              ),
            ];
            break;
          case "BLOCK":
            this.gameEntities = [
              new GameBlock({
                x: fieldEffect.xPos,
                y: fieldEffect.yPos,
                w: 200,
                h: 200,
              }),
            ];
            break;
          default:
            break;
        }
        this.setEntities?.(this.gameEntities);
        break;
      default:
        break;
    }
  };

  listenToGameLoopCallBack = (data: GameDTO) => {
    // console.log(data);
    // console.log(data.ballPosX, data.ballPosY);
    // console.log("isLeft: ", this.isLeft);
    if (this.isLeft) {
      this.rightPaddlePosition = { x: 1600 - 45, y: data.rightPaddlePosY };
    } else {
      this.leftPaddlePosition = { x: 30, y: data.leftPaddlePosY };
    }
    this.player1Score = data.player1Score;
    this.player2Score = data.player2Score;

    if (data.blockX && data.blockY)
      this.blockPosition = { x: data.blockX, y: data.blockY };
    if (this.usingLocalTick) return;
    this._pongSpeed = { x: data.ballVelX, y: data.ballVelY };
    this._pongPosition = { x: data.ballPosX, y: data.ballPosY };
  };

  listenToGameResponse = (data: GameResponseDTO) => {
    // console.log(data);
  };

  updatePlayerPosition(y: number, x: number) {
    if (this.isLeft) {
      this.leftPaddlePosition = { x: 30, y: y };
    } else {
      this.rightPaddlePosition = { x: 1600 - 46, y: y };
    }
    this.sendPlayerMove?.(y, x, this.gameRoom);
  }

  updatePlayerClick(isMouseDown: boolean) {
    this.sendPlayerClick?.(isMouseDown, this.gameRoom);
  }

  async useLocalTick() {
    this.usingLocalTick = true;
    this.localTicker = new PIXI.Ticker();
    this.localTicker.add(this._localTick.bind(this));
    this.localTicker.start();
  }

  disableLocalTick() {
    this.usingLocalTick = false;
    if (!this.localTicker) return;
    this.localTicker.remove(this._localTick.bind(this));
    this.localTicker.stop();
    this.localTicker.destroy();
  }

  private _localTick(delta: number) {
    if (!this.usingLocalTick) return;
    if (this._pongPosition.x <= 0 || this._pongPosition.x >= 1590) {
      this._pongPosition.x = 800;
      this._pongPosition.y = 450;
    }
    if (this._pongPosition.y <= 0 || this._pongPosition.y >= 900 - 10)
      this._pongSpeed.y *= -1;

    this._pongPosition.x += this.pongSpeed.x * delta;
    this._pongPosition.y += this.pongSpeed.y * delta;
  }

  applGlobalEffectToParticle(particle: GameParticle) {
    particle.vx *= this.globalSpeedFactor;
    particle.vy *= this.globalSpeedFactor;
    particle.ax *= this.globalSpeedFactor;
    particle.ay *= this.globalSpeedFactor;
    particle.w *= this.globalScaleFactor;
    particle.h *= this.globalScaleFactor;
  }
}
