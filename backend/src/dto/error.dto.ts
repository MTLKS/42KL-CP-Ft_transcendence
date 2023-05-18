import { ApiProperty } from '@nestjs/swagger';

export class ErrorDTO {
	constructor(error: string) {
		this.error = error;
	}

	@ApiProperty({ example: "Error Type - error description" })
	error: string;
}