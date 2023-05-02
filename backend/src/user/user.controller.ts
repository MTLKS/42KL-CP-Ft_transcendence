import { Controller, Get, Headers, UseGuards, Param, Post, Body, UseInterceptors, UploadedFile, Res, Patch } from '@nestjs/common';
import { INTERCEPTOR_CONFIG } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
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
	
	@Get('intra/:intraName')
	@UseGuards(AuthGuard)
	getIntraDataByIntraName(@Headers('Authorization') accessToken: string, @Param('intraName') intraName: string): any {
		return this.userService.getIntraDataByIntraName(accessToken, intraName);
	}

	@Get('avatar')
	@UseGuards(AuthGuard)
	getMyAvatar(@Headers('Authorization') accessToken: string, @Res() res: any): any {
		return this.userService.getMyAvatar(accessToken, res);
	}

	@Get('avatar/:intraName')
	getAvatarByIntraName(@Param('intraName') intraName: string, @Res() res: any): any {
		return this.userService.getAvatarByIntraName(intraName, res);
	}

	@Get(':intraName')
	@UseGuards(AuthGuard)
	getUserDataByIntraName(@Param('intraName') intraName: string): any {
		return this.userService.getUserDataByIntraName(intraName);
	}

	@Post()
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('image', INTERCEPTOR_CONFIG))
	newUserInfo(@Headers('Authorization') accessToken: string, @Body() body: any, @UploadedFile() image: any): any {
		return this.userService.newUserInfo(accessToken, body.userName, image);
	}

	@Patch()
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('image', INTERCEPTOR_CONFIG))
	updateUserInfo(@Headers('Authorization') accessToken: string, @Body() body: any, @UploadedFile() image: any): any {
		return this.userService.updateUserInfo(accessToken, body.userName, image);
	}
}