import { Application, ICanvas } from "pixi.js";
import SocketApi from "../api/socketApi";
import { GameDTO } from "../model/GameDTO";
import { BoxSize, Offset } from "../model/GameModels";
import { ReactPixiRoot, createRoot, AppProvider } from "@pixi/react";

export class GameData {
  socketApi: SocketApi;
  private _pongPosition: Offset = { x: 800, y: 450 };
  private _pongSpeed: Offset = { x: 12, y: 8 };
  leftPaddlePosition: Offset = { x: 0, y: 0 };
  rightPaddlePosition: Offset = { x: 0, y: 0 };
  usingLocalTick: boolean = false;
  isLeft: boolean = true;
  gameStarted: boolean = false;
  roomID: string | undefined;

  setScale?: (scale: number) => void;
  setShouldRender?: (shouldRender: boolean) => void;

  constructor() {
    console.log("gameTick created");
    this.socketApi = new SocketApi("game");
    this.socketApi.listen("gameLoop", this.listenToGameLoopCallBack);
    this.socketApi.listen("gameState", this.listenToGameState);
    this.socketApi.listen("gameError", this.listenToGameError);
  }

  get pongPosition() {
    return { ...this._pongPosition } as Readonly<Offset>;
  }

  get pongSpeed() {
    return { ...this._pongSpeed } as Readonly<Offset>;
  }

  startGame() {
    if (this.gameStarted) {
      console.error("game already started");
      return;
    }
    console.log("start game");
    this.gameStarted = true;
    this.setShouldRender?.(true);
    this.socketApi.sendMessages("joinQueue", { queue: "standard" });
  }

  endGame() {
    console.log("end game");
    if (!this.gameStarted) return;
    this.gameStarted = false;
    this.setShouldRender?.(false);
    this.socketApi.removeListener("gameLoop");
    this.socketApi.removeListener("gameState");
    this.socketApi.removeListener("gameError");
  }

  set setSetScale(setScale: (scale: number) => void) {
    this.setScale = setScale;
  }

  set setSetShouldRender(setShouldRender: (shouldRender: boolean) => void) {
    this.setShouldRender = setShouldRender;
  }

  listenToGameState = (data: any) => {
    console.log(data);

    if (data.type === "GameStart") this.roomID = data.data;
    else if (data.type === "IsLeft") this.isLeft = data.data;
  };

  listenToGameLoopCallBack = (data: GameDTO) => {
    // console.log(data.ballPosX, data.ballPosY);
    this._pongPosition = { x: data.ballPosX, y: data.ballPosY };
    if (this.isLeft) {
      this.rightPaddlePosition = { x: 1600 - 45, y: data.rightPaddlePosY };
    } else {
      this.leftPaddlePosition = { x: 30, y: data.leftPaddlePosY };
    }
    this._pongSpeed = { x: data.ballVelX, y: data.ballVelY };
  };

  listenToGameError = (data: any) => {
    console.log(data.error);
  };

  updatePlayerPosition(y: number) {
    if (this.isLeft) {
      this.leftPaddlePosition = { x: 30, y: y };
    } else {
      this.rightPaddlePosition = { x: 1600 - 46, y: y };
    }

    if (this.roomID)
      this.socketApi.sendMessages("playerMove", { y: y, roomID: this.roomID });
  }

  useLocalTick() {
    this.usingLocalTick = true;
    this._pongSpeed = { x: 5, y: 5 };
    this._localTick();
  }

  disableLocalTick() {
    this.usingLocalTick = false;
  }

  private _localTick() {
    if (!this.useLocalTick) return;
    if (this._pongPosition.x < 0 || this._pongPosition.x > 1600 - 46)
      this._pongSpeed.x *= -1;
    if (this._pongPosition.y < 0 || this._pongPosition.y > 900 - 46)
      this._pongSpeed.y *= -1;

    this._pongPosition.x += this.pongSpeed.x;
    this._pongPosition.y += this.pongSpeed.y;
    requestAnimationFrame(this.useLocalTick);
  }
}
