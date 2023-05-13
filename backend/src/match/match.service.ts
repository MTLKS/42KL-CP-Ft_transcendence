import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entity/match.entity';
import { Repository, Not } from "typeorm";

@Injectable()
export class MatchService {
	constructor(@InjectRepository(Match) private matchRepository: Repository<Match>) { }

	async createNewMatch(player1IntraName: string, player2IntraName: string, player1Score: number, player2Score: number, winner: string, gameType: string, wonBy: string) {
		let newMatch = new Match(player1IntraName, player2IntraName, player1Score, player2Score, winner, gameType, wonBy);
		await this.matchRepository.save(newMatch);
	}

	async getMatchesByIntraName(intraName: string, perPage?: number, page?: number) {
		let take = (perPage !== undefined && perPage > 0) ? (perPage >= 100 ? 100 : perPage) : 100;
		let skip = (page !== undefined && page >= 0) ? (page * take) : 0;

		const MATCH_DATA = await this.matchRepository.find({
			where: [
				{ player1IntraName: intraName },
				{ player2IntraName: intraName }
			],
			order: {
				matchDate: "DESC"
			},
			skip: skip,
			take: take
		});
		return MATCH_DATA;
	}

	async getStatsByIntraName(intraName: string) {
		const WIN_COUNT = await this.matchRepository.count({
			where: [
				{ player1IntraName: intraName, winner: intraName },
				{ player2IntraName: intraName, winner: intraName }
			]
		});

		const LOSE_COUNT = await this.matchRepository.count({
			where: [
				{ player1IntraName: intraName, winner: Not(intraName) },
				{ player2IntraName: intraName, winner: Not(intraName) }
			]
		});

		return { win: WIN_COUNT, lose: LOSE_COUNT };
	}
}
