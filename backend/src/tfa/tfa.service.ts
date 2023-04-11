import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import * as qrCode from "qrcode";

@Injectable()
export class TFAService{
	async requestSecret() : Promise<any>{
		const ACCOUNT_NAME = "username";
		const SERVICE = "PONGSH"
		const SECRET = authenticator.generateSecret()
		const OTP_PATH = authenticator.keyuri(ACCOUNT_NAME, SERVICE, SECRET);
		const IMAGE_URL = await qrCode.toDataURL(OTP_PATH);
    return { qr : IMAGE_URL, secretKey : SECRET };
	}
	
	generateOTP(secret : string) : string{
		return (authenticator.generate(secret));
	}

	validateOTP(otp : string, userSecret : string) : boolean{
		return (authenticator.verify({
			token : otp, 
			secret : userSecret,
		}));
	}
}