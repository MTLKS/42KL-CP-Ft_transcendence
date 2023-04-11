import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from 'src/guard/AuthGuard';
import { TFAService } from "./tfa.service";
import { Headers } from "@nestjs/common";

@Controller('2fa')
export class TFAController{
	constructor (private readonly tfaService : TFAService){}

	@Get()
	@UseGuards(AuthGuard)
	async requestSecret(@Headers('Authorization') accessToken: string) {
		return await this.tfaService.requestSecret(accessToken);
	}
	
	@Post(':otp')
	@UseGuards(AuthGuard)
	async validateOTP(@Headers('Authorization') accessToken: string, @Param('otp') code: string ): Promise<any> {
		return await this.tfaService.validateOTP(accessToken, code)
	}
}