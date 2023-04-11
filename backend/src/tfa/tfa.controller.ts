import { Body, Controller, Post } from "@nestjs/common";
import { TFAService } from "./tfa.service";

@Controller('2fa')
export class TFAController{
	constructor (private readonly tfaService : TFAService){}
	private myArray = new Array();

	@Post('enable')
	async requestSecret(){
		const SECRET =await this.tfaService.requestSecret();
		this.myArray.push(SECRET.secretKey);
		return (SECRET);
	}
	
	@Post('generate')
	async generateOTP() : Promise<string> {
		return (await this.tfaService.generateOTP(this.myArray[0]));
	}

	@Post('validate')
	async validateOTP(@Body() body : {token :string})
	: Promise<boolean>{
		return (await this.tfaService.validateOTP(body.token, this.myArray[0]));
	}

}