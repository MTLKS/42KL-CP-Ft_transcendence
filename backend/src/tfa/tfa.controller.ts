import { Controller, Get, Post, Param, UseGuards, Headers, Body } from "@nestjs/common";
import { AuthGuard } from 'src/guard/AuthGuard';
import { TFAService } from "./tfa.service";

@Controller('2fa')
export class TFAController{
	constructor (private readonly tfaService: TFAService){}

	@Get()
	@UseGuards(AuthGuard)
	async requestNewSecret(@Headers('Authorization') accessToken: string) {
		return await this.tfaService.requestNewSecret(accessToken);
	}
	
	@Post()
	@UseGuards(AuthGuard)
	async validateOTP(@Headers('Authorization') accessToken: string, @Body() body: any ): Promise<any> {
		return await this.tfaService.validateOTP(accessToken, body.otp)
	}
}