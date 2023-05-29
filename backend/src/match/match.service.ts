import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entity/match.entity';
import { User } from 'src/entity/users.entity';
import { Repository, Not } from "typeorm";

@Injectable()
export class MatchService {
	constructor(@InjectRepository(Match) private matchRepository: Repository<Match>) { }

	async createNewMatch(player1: User, player2: User, player1Score: number, player2Score: number, winner: string, gameType: string, wonBy: string) {
		let newMatch = new Match(player1, player2, player1Score, player2Score, winner, gameType, wonBy);
		await this.matchRepository.save(newMatch);
	}

	async getMatchesByUserName(userName: string, perPage?: number, page?: number) {
		perPage = Number(perPage);
		page = Number(page);
		let take = (perPage !== undefined && perPage > 0) ? (perPage >= 100 ? 100 : perPage) : 100;
		let skip = (page !== undefined && page >= 0) ? (page * take) : 0;

		const MATCH_DATA = await this.matchRepository.find({
			where: [
				{ player1: { userName: userName }},
				{ player2: { userName: userName }}
			],
			relations: { player1: true, player2: true },
			order: {
				matchDate: "DESC"
			},
			skip: skip,
			take: take
		});
		return MATCH_DATA;
	}

	async getStatsByUserName(userName: string) {
		const WIN_COUNT = await this.matchRepository.count({
			where: [
				{ player1: { userName: userName }, winner: userName },
				{ player2: { userName: userName }, winner: userName }
			],
		});

		const LOSE_COUNT = await this.matchRepository.count({
			where: [
				{ player1: { userName: userName }, winner: Not(userName) },
				{ player2: { userName: userName }, winner: Not(userName) }
			]
		});
	
		const MATCH_DATA = await this.getMatchesByUserName(userName, 100, 0);
		const wins: string [] = [];
		const losses: string [] = [];
		for (const match of MATCH_DATA) {
			if (userName === match.player1.userName) {
				if (userName === match.winner)
					wins.push(match.player2.userName);
				else
					losses.push(match.player2.userName);
			} else {
				if (userName === match.winner)
					wins.push(match.player1.userName);
				else
					losses.push(match.player1.userName);
			}
		}

		const PUNCHING_BAG = this.getMostCommonPlayer(wins);
		const WORST_NIGHTMARE = this.getMostCommonPlayer(losses);

		return { win: WIN_COUNT, lose: LOSE_COUNT, worst_nightmare: WORST_NIGHTMARE, punching_bag: PUNCHING_BAG };
	}

	private getMostCommonPlayer(players: string[]): string {
		const playerCount = new Map<string, number>();

		for (const player of players) {
      const count = playerCount.get(player) || 0;
      playerCount.set(player, count + 1);
    }

    const sortedPlayers = [...playerCount.entries()].sort((a, b) => b[1] - a[1]);
    return sortedPlayers.length > 0 ? sortedPlayers[0][0] : "";
	}
}
