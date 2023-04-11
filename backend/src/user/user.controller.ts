import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/AuthGuard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseGuards(AuthGuard)
	getMyUserData(@Headers('Authorization') accessToken: string): any {
		return this.userService.getMyUserData(accessToken);
	}

	@Get('intra')
	@UseGuards(AuthGuard)
	getMyIntraData(@Headers('Authorization') accessToken: string): any {
		return this.userService.getMyIntraData(accessToken);
	}
}