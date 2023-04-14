import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import * as CryptoJS from "crypto-js";
import { Repository } from "typeorm";
import * as qrCode from "qrcode";

@Injectable()
export class TFAService{
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) {}

	async requestSecret(accessToken: string) : Promise<any> {
		try {
			const INTRA_DTO = await this.userService.getMyIntraData(accessToken);
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
			const DATA = await this.userRepository.find({ where: {accessToken} });
			DATA[0].tfaSecret = authenticator.generateSecret();
			const ACCOUNT_NAME = INTRA_DTO.name;
			const SERVICE = "PONGSH"
			const OTP_PATH = authenticator.keyuri(ACCOUNT_NAME, SERVICE, DATA[0].tfaSecret);
			const IMAGE_URL = await qrCode.toDataURL(OTP_PATH);
			this.userRepository.save(DATA[0]);
			return { qr : IMAGE_URL, secretKey : DATA[0].tfaSecret };
		} catch {
			return { qr: null, secretKey: null };
		}
	}

	async validateOTP(accessToken: string, otp: string) : Promise<any> {
		try {
			accessToken = CryptoJS.AES.decrypt(accessToken, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
			const DATA = await this.userRepository.find({ where: {accessToken} });
			return { boolean: authenticator.verify({
				token : otp, 
				secret : DATA[0].tfaSecret,
			}) };
		} catch {
			return { boolean: false};
		}
	}
}