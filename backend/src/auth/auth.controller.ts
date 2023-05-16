import { Controller, Get, Post, Body, Headers, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	startLogin(@Headers('Authorization') accessToken: any): any {
		return this.authService.startLogin(accessToken);
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	startGoogleLogin(@Req() req: any): any {
		return;
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Req() req: any): any {
		return this.authService.googleAuthRedirect(req);
	}
	
	@Post()
	postCode(@Body() body: any): any {
		return this.authService.postCode(body.code);
	}
}
