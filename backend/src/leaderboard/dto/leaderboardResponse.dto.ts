import { ApiProperty } from '@nestjs/swagger'

export class LeaderboardResponseDTO {
	@ApiProperty({ example: "schuah" })
	userName: string;

	@ApiProperty({ example: 200 })
	elo: number;
}