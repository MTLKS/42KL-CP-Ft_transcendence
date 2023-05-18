import { Controller, Get, Headers } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { AppDTO } from './dto/app.dto';

@ApiTags('App')
@Controller()
export class AppController {
	constructor(private readonly authService: AuthService) {}

	@ApiOkResponse({ description: "Used to initiate the login process for a user", type: AppDTO })
	@ApiHeader({ name: 'Authorization', description: 'The encrypted access token of the user', required: true })
	@Get()
	startLogin(@Headers('Authorization') accessToken: string): Promise<AppDTO> {
		return this.authService.startLogin(accessToken);
	}
}
