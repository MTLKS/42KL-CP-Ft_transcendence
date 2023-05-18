import { ApiProperty } from '@nestjs/swagger';

export class PostCodeBodyDTO {
	@ApiProperty({ example: "abc123" })
	code: string;
}

export class PostCodeResponseDTO {
	@ApiProperty({ example: "abc123" })
	accessToken: null | string;

	@ApiProperty({ example: true })
	newUser: boolean;
}