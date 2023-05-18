import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppDTO {
	@ApiProperty({ example: "http://localhost:3000" })
	redirectUrl: string;
}