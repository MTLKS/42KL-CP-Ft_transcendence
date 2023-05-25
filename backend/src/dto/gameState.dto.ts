import { PowerUp } from "src/game/game.service";

export class GameStartDTO {
	opponentIntraName: string;
	gameType: string;
	isLeft: boolean;
	gameRoom: string;
	player1PowerUp:PowerUp;
	player2PowerUp:PowerUp;

	constructor(opponentIntraName: string, gameType: string, isLeft: boolean, gameRoom: string,
		player1PowerUp:PowerUp = PowerUp.NORMAL, player2PowerUp:PowerUp = PowerUp.NORMAL) {
		this.opponentIntraName = opponentIntraName;
		this.gameType = gameType;
		this.isLeft = isLeft;
		this.gameRoom = gameRoom;
		this.player1PowerUp = player1PowerUp;
		this.player2PowerUp = player2PowerUp;
	}
}

export class GameEndDTO {
	winner: string;
	wonBy: "score" | "abandon";
	finalScore: Array<number>;

	constructor(player1Score: number, player2Score: number){
		
	}
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
	
	constructor(type: "NORMAL" | "GRAVITY" | "TIME_ZONE" | "BLACK_HOLE" | "BLOCK", xPos: number, yPos: number, magnitude: number) {
		this.type = type;
		this.xPos = xPos;
		this.yPos = yPos;
		this.magnitude = magnitude;
	}
}

export class LobbyStartDTO {
	player1IntraName: string;
	player2IntraName: string;

	constructor(player1IntraName: string, player2IntraName: string) {
		this.player1IntraName = player1IntraName;
		this.player2IntraName = player2IntraName;
	}
}

export class GameStateDTO {
	type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect" | "LobbyStart";
	data : GameStartDTO | GameEndDTO | GamePauseDTO | FieldEffectDTO | LobbyStartDTO;

	constructor(type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect" | "LobbyStart", data : GameStartDTO | GameEndDTO | GamePauseDTO | FieldEffectDTO | LobbyStartDTO) {
		this.type = type;
		this.data = data;
	}
}