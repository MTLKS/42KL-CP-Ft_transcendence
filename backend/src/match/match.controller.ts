import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { AuthGuard } from 'src/guard/AuthGuard';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { MatchInputDTO, MatchResponseDTO, MatchStatsResponseDTO } from 'src/dto/match.dto';

@ApiTags('Match')
@Controller('match')
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@ApiOkResponse({ type: [MatchResponseDTO] })
	@Get(':userName')
	@UseGuards(AuthGuard)
	getMatchesByUsername(@Param('userName') userName: string, @Query() query: MatchInputDTO): any {
		return this.matchService.getMatchesByUserName(userName, query.perPage, query.page);
	}

	@ApiOkResponse({ type: MatchStatsResponseDTO })
	@Get('stats/:userName')
	@UseGuards(AuthGuard)
	getStatsByUsername(@Param('userName') userName: string): any {
		return this.matchService.getStatsByUserName(userName);
	}
}
