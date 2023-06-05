import { ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorDTO {
	constructor(error: string) {
		this.error = error;
		throw new HttpException(this, HttpStatus.BAD_REQUEST);
	}

	@ApiProperty({ example: "Error Type - error description" })
	error: string;
}