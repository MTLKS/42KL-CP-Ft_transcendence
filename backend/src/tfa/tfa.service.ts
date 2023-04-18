import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import * as qrCode from "qrcode";

@Injectable()
export class TFAService{
	private myArray = new Array();

	async requestSecret() : Promise<any>{
		const ACCOUNT_NAME = "username";
		const SERVICE = "PONGSH"
		const SECRET = authenticator.generateSecret()
		const OTP_PATH = authenticator.keyuri(ACCOUNT_NAME, SERVICE, SECRET);
		const IMAGE_URL = await qrCode.toDataURL(OTP_PATH);
		this.myArray.push(SECRET);
    return { qr : IMAGE_URL, secretKey : SECRET };
	}

	validateOTP(otp : string) : any {
		return ({ boolean: authenticator.verify({
			token : otp, 
			secret : this.myArray[0],
		}) } );
	}
}