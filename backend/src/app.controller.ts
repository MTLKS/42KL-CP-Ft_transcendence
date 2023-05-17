import { Controller, Get, Headers } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { AppDTO } from './dto/app.dto';

@ApiTags('App')
@Controller()
export class AppController {
	constructor(private readonly authService: AuthService) {}

	@ApiOkResponse({ type: AppDTO })
	@Get()
	startLogin(@Headers('Authorization') accessToken: string): Promise<AppDTO> {
		return this.authService.startLogin(accessToken);
	}
}
