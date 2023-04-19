import { Controller, Get, Headers, UseGuards, Param, Post, Body } from '@nestjs/common';
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

	@Get(':id')
	@UseGuards(AuthGuard)
	getUserDataById(@Param('id') id: string): any {
		return this.userService.getUserDataById(id);
	}

	@Get('intra/:id')
	@UseGuards(AuthGuard)
	getIntraDataById(@Headers('Authorization') accessToken: string, @Param('id') id: string): any {
		return this.userService.getIntraDataById(accessToken, id);
	}

	@Post()
	@UseGuards(AuthGuard)
	newUserInfo(@Headers('Authorization') accessToken: string, @Body() body: any ): any {
		return this.userService.newUserInfo(accessToken, body);
	}
}