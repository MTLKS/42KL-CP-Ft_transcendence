export class GameStartDTO {
	opponentIntraName: string;
	gameType: string;
	isLeft: boolean;

	constructor(opponentIntraName: string, gameType: string, isLeft: boolean) {
		this.opponentIntraName = opponentIntraName;
		this.gameType = gameType;
		this.isLeft = isLeft;
	}
}

export class GameEndDTO {
	winner: string;
	wonBy: "normal" | "abandon";
	finalScore: Array<number>;
}

export class GamePauseDTO {
	abandonDate: Date;
}

export class GameStateDTO {
	type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect";
	data : GameStartDTO | GameEndDTO | GamePauseDTO;

	constructor(type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect", data : GameStartDTO | GameEndDTO | GamePauseDTO) {
		this.type = type;
		this.data = data;
	}
}