import { ApiPropertyOptional } from '@nestjs/swagger'

export class LeaderboardInputDTO {
	@ApiPropertyOptional({ example: 100 })
	perPage?: number;

	@ApiPropertyOptional({ example: 0 })
	page?: number;
}