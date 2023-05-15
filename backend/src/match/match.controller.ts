import { Controller, Get, Param, Body, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { AuthGuard } from 'src/guard/AuthGuard';

@Controller('match')
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Get(':intraName')
	@UseGuards(AuthGuard)
	getMatchesByIntraName(@Param('intraName') intraName: string, @Body('perPage') perPage?: number, @Body('page') page?: number): any {
		return this.matchService.getMatchesByIntraName(intraName, perPage, page);
	}

	@Get('stats/:intraName')
	@UseGuards(AuthGuard)
	getStatsByIntraName(@Param('intraName') intraName: string): any {
		return this.matchService.getStatsByIntraName(intraName);
	}
}
