import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { TFAService } from "./tfa.service";
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('2fa')
export class TFAController{
	constructor (private readonly tfaService : TFAService){}

	@Get('secret')
	@UseGuards(AuthGuard)
	async requestSecret(){
		return await this.tfaService.requestSecret();
	}
	
	@Post('validate')
	@UseGuards(AuthGuard)
	async validateOTP(@Body() body : { token :string } ): Promise<boolean> {
		return await this.tfaService.validateOTP(body.token)
	}
}