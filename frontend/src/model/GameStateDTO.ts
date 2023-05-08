export interface GameStartDTO {
	opponentIntraName: string,
	gameType: string,
	isLeft: boolean
}

export interface GameEndDTO {
	winner: string,
	wonBy: "normal" | "abandon",
	finalScore: Array<number>
}

export interface GamePauseDTO {
	abandonDate: Date
}

export interface GameStateDTO {
	type: "GameStart" | "GameEnd" | "GamePause" | "FieldEffect",
	data : GameStartDTO | GameEndDTO | GamePauseDTO
}