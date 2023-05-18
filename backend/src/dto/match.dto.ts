import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { User } from 'src/entity/users.entity'

export class MatchInputDTO {
	@ApiPropertyOptional({ example: 3 })
	perPage?: number;

	@ApiPropertyOptional({ example: 0 })
	page?: number;
}

export class MatchResponseDTO {
	@ApiProperty({ type: User }) //TODO: Change to UserDTO
	player1: User;

	@ApiProperty({ type: User }) //TODO: Change to UserDTO
	player2: User;

	@ApiProperty({ example: 5 })
	player1Score: number;

	@ApiProperty({ example: 3 })
	player2Score: number;

	@ApiProperty({ example: "itan" })
	winner: string;

	@ApiProperty({ example: "standard" })
	gameType: string;

	@ApiProperty({ example: "score" })
	wonBy: string;

	@ApiProperty({ example: 1 })
	matchId: number;

	@ApiProperty({ example: "2023-05-16T14:39:35.193Z" })
	matchDate: Date;
}

export class MatchStatsResponseDTO {
	@ApiProperty({ example: "69" })
	win: number;

	@ApiProperty({ example: "42" })
	lose: number;

	@ApiProperty({ type: User }) //TODO: Change to UserDTO
	worst_nightmare: User;

	@ApiProperty({ type: User }) //TODO: Change to UserDTO
	punching_bag: User;
}