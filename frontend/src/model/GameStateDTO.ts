export class GameStartDTO {
  opponentIntraName: string;
  gameType: "boring" | "standard" | "death" | "";
  isLeft: boolean;
  gameRoom: string;
  player1PowerUp: number;
  player2PowerUp: number;

  constructor(
    opponentIntraName: string,
    gameType: "boring" | "standard" | "death" | "",
    isLeft: boolean,
    gameRoom: string,
    player1PowerUp: number,
    player2PowerUp: number
  ) {
    this.opponentIntraName = opponentIntraName;
    this.gameType = gameType;
    this.isLeft = isLeft;
    this.gameRoom = gameRoom;
    this.player1PowerUp = player1PowerUp;
    this.player2PowerUp = player2PowerUp;
  }
}

export class GameEndDTO {
  // winner: string;
  // wonBy: "score" | "abandon";
  // finalScore: Array<number>;

  constructor(player1Score: number, player2Score: number) {}
}

export class GamePauseDTO {
  abandonDate: number;

  constructor(abandonDate: number) {
    this.abandonDate = abandonDate;
  }
}

export class FieldEffectDTO {
  type: "NORMAL" | "GRAVITY" | "TIME_ZONE" | "BLACK_HOLE" | "BLOCK";
  xPos: number;
  yPos: number;
  magnitude: number;

  constructor(
    type: "NORMAL" | "GRAVITY" | "TIME_ZONE" | "BLACK_HOLE" | "BLOCK",
    xPos: number,
    yPos: number,
    magnitude: number
  ) {
    this.type = type;
    this.xPos = xPos;
    this.yPos = yPos;
    this.magnitude = magnitude;
  }
}

export class GameStateDTO {
  type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect";
  data: GameStartDTO | GameEndDTO | GamePauseDTO | FieldEffectDTO;

  constructor(
    type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect",
    data: GameStartDTO | GameEndDTO | GamePauseDTO | FieldEffectDTO
  ) {
    this.type = type;
    this.data = data;
  }
}
