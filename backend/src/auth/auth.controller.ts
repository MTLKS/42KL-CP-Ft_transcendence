import { Controller, Get, Post, Body, Headers, UseGuards, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetRedirectDTO, PostCodeBodyDTO, PostCodeResponseDTO } from 'src/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	@ApiHeader({ name: 'Authorization', description: 'The encrypted access token of the user', required: false })
	@ApiOkResponse({ description: "Used to initiate the login process for a user", type: GetRedirectDTO })
	startLogin(@Headers('Authorization') accessToken: string): Promise<GetRedirectDTO> {
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
	@ApiCreatedResponse({ description: "Used to trade the code to get the access token of a user (Code will expire upon use)", type: PostCodeResponseDTO })
	postCode(@Body() body: PostCodeBodyDTO): Promise<PostCodeResponseDTO> {
		return this.authService.postCode(body.code);
	}
}
