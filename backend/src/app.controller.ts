import { Controller, Get, Headers } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { GetRedirectDTO } from './dto/auth.dto';

@ApiTags('App')
@Controller()
export class AppController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	@ApiOkResponse({ description: "Used to initiate the login process for a user", type: GetRedirectDTO })
	@ApiHeader({ name: 'Authorization', description: 'The encrypted access token of the user', required: false })
	startLogin(@Headers('Authorization') accessToken: string): Promise<GetRedirectDTO> {
		return this.authService.startLogin(accessToken);
	}
}
