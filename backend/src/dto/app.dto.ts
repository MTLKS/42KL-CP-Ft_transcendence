import { ApiPropertyOptional } from '@nestjs/swagger';

export class AppDTO {
	@ApiPropertyOptional({ example: "https://google.com" })
	redirectUrl?: string;
}