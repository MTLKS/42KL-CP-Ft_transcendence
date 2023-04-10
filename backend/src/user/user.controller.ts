import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getMyData(@Headers() header): any {
		return this.userService.getMyData(header);
	}
}