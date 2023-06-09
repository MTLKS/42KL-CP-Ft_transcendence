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

export class LobbyStartDTO {
	gameType: "boring" | "standard" | "death" | "";
	player1IntraName: string;
	player2IntraName: string;

	constructor(player1IntraName: string, player2IntraName: string, gameType: "boring" | "standard" | "death" | "") {
		this.player1IntraName = player1IntraName;
		this.player2IntraName = player2IntraName;
		this.gameType = gameType;
	}
}

export class LobbyEndDTO {
	culprit: string;
	reason: string;

	constructor(culprit: string, reason: string) {
		this.culprit = culprit;
		this.reason = reason;
	}
}

export class CountdonwDTO{
	countdown: number;

	constructor(countdown: number) {
		this.countdown = countdown;
	}
}

export class GameStateDTO {
	type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect" | "LobbyStart" | "LobbyEnd" | "LobbyCountdown" | "GameCountdown";
	data : GameStartDTO | GameEndDTO | GamePauseDTO | FieldEffectDTO | LobbyStartDTO | LobbyEndDTO | CountdonwDTO;

	constructor(type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect" | "LobbyStart" | "LobbyEnd" | "LobbyCountdown" | "GameCountdown",
	data : GameStartDTO | GameEndDTO | GamePauseDTO | FieldEffectDTO | LobbyStartDTO | LobbyEndDTO | CountdonwDTO) {
		this.type = type;
		this.data = data;
	}
}