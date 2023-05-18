import { ApiProperty } from '@nestjs/swagger';

export class GetRedirectDTO {
	constructor(redirectUrl: string) {
		this.redirectUrl = redirectUrl;
	}
	
	@ApiProperty({ example: "http://localhost:3000" })
	redirectUrl: string;
}

export class PostCodeBodyDTO {
	@ApiProperty({ example: "abc123" })
	code: string;
}

export class PostCodeResponseDTO {
	constructor(accessToken: string, newUser: boolean) {
		this.accessToken = accessToken;
		this.newUser = newUser;
	}

	@ApiProperty({ example: "abc123" })
	accessToken?: null | string;

	@ApiProperty({ example: true })
	newUser: boolean;
}