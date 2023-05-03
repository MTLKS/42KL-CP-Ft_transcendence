import { Application, ICanvas } from "pixi.js";
import SocketApi from "../api/socketApi";
import { GameDTO } from "../modal/GameDTO";
import { BoxSize, Offset } from "../modal/GameModels";
import { ReactPixiRoot, createRoot, AppProvider } from "@pixi/react";

export class GameTick {
  socketApi: SocketApi;
  pongPosition: Offset;
  pongSpeed: Offset;
  leftPaddlePosition: Offset;
  rightPaddlePosition: Offset;
  usingLocalTick: boolean = false;
  isLeft: boolean = true;
  roomID: string = "";

  setScale?: (scale: number) => void;

  constructor() {
    console.log("gameTick created");
    this.socketApi = new SocketApi("game");
    this.pongPosition = { x: 0, y: 0 };
    this.leftPaddlePosition = { x: 0, y: 0 };
    this.rightPaddlePosition = { x: 0, y: 0 };
    this.pongSpeed = { x: 0, y: 0 };
  }

  destructor() {
    this.socketApi.removeListener("gameLoop");
    this.socketApi.removeListener("gameState");
  }

  set setSetScale(setScale: (scale: number) => void) {
    this.setScale = setScale;
  }

  listenToGameState = (data: any) => {
    console.log(data);
  };

  listenToGameLoopCallBack = (data: GameDTO) => {
    // console.log(data.ballPosX, data.ballPosY);
    this.pongPosition = { x: data.ballPosX, y: data.ballPosY };
    if (this.isLeft) {
      this.rightPaddlePosition = { x: 1600 - 46, y: data.rightPaddlePosY };
    } else {
      this.leftPaddlePosition = { x: 30, y: data.leftPaddlePosY };
    }
    this.pongSpeed = { x: data.ballVelX, y: data.ballVelY };
  };

  set isLeftPlayer(isLeft: boolean) {
    this.isLeft = isLeft;
  }

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
    this._localTick();
  }

  disableLocalTick() {
    this.usingLocalTick = false;
  }

  private _localTick() {
    if (!this.useLocalTick) return;
    this.pongPosition.x += this.pongSpeed.x;
    this.pongPosition.y += this.pongSpeed.y;
    requestAnimationFrame(this.useLocalTick);
  }
}
