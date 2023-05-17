import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity( { name: "matches" } )
export class Match {
	constructor(player1IntraName: string, player2IntraName: string, player1Score: number, player2Score: number, winner: string, gameType: string, wonBy: string) {
		this.player1IntraName = player1IntraName;
		this.player2IntraName = player2IntraName;
		this.player1Score = player1Score;
		this.player2Score = player2Score;
		this.winner = winner;
		this.gameType = gameType;
		this.wonBy = wonBy;
	}

	@PrimaryGeneratedColumn()
	matchId: number;

	@Column()
	player1IntraName: string;

	@Column()
	player2IntraName: string;

	@Column()
	player1Score: number;

	@Column()
	player2Score: number;

	@Column()
	winner: string;

	@Column()
	gameType: string;

	@Column()
	wonBy: string;

	@CreateDateColumn()
	matchDate: Date;
}