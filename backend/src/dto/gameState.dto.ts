export class GameStartDTO {
	opponentIntraName: string;
	gameType: string;
	isLeft: boolean;
	gameRoom: string;

	constructor(opponentIntraName: string, gameType: string, isLeft: boolean, gameRoom: string) {
		this.opponentIntraName = opponentIntraName;
		this.gameType = gameType;
		this.isLeft = isLeft;
		this.gameRoom = gameRoom;
	}
}

export class GameEndDTO {
	winner: string;
	wonBy: "normal" | "abandon";
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

export class GameStateDTO {
	type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect";
	data : GameStartDTO | GameEndDTO | GamePauseDTO;

	constructor(type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect", data : GameStartDTO | GameEndDTO | GamePauseDTO) {
		this.type = type;
		this.data = data;
	}
}