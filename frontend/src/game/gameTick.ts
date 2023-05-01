import SocketApi from "../api/socketApi";
import { GameDTO } from "../modal/GameDTO";
import { Offset } from "../modal/GameModels";

export class GameTick {
  socketApi: SocketApi;
  pongPosition: Offset;
  pongSpeed: Offset;
  leftPaddlePosition: Offset;
  rightPaddlePosition: Offset;
  usingLocalTick: boolean = false;
  isLeft: boolean = true;

  constructor() {
    console.log("gameTick created");
    this.socketApi = new SocketApi("game");
    this.pongPosition = { x: 0, y: 0 };
    this.leftPaddlePosition = { x: 0, y: 0 };
    this.rightPaddlePosition = { x: 0, y: 0 };
    this.pongSpeed = { x: 0, y: 0 };
    this.socketApi.sendMessages("startGame", { ok: "ok" });
    this.socketApi.listen("gameLoop", this.listenToGameLoopCallBack);
  }

  destructor() {
    this.socketApi.removeListener("gameLoop");
  }

  listenToGameLoopCallBack = (data: GameDTO) => {
    this.pongPosition = { x: data.ballPosX, y: data.ballPosY };
    if (this.isLeft) {
      this.rightPaddlePosition = { x: 1600 - 46, y: data.rightPaddlePosY };
    } else {
      this.leftPaddlePosition = { x: 30, y: data.leftPaddlePosY };
    }
    this.pongSpeed = { x: data.velX, y: data.velY };
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
    this.socketApi.sendMessages("playerMove", { y: y });
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
