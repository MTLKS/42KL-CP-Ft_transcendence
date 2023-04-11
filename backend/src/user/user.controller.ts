import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/AuthGuard';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('intra')
	@UseGuards(AuthGuard)
	getMyData(@Headers('Authorization') accessToken: string): any {
		return this.userService.getMyData(accessToken);
	}
}