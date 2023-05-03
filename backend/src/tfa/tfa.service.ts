import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { Repository } from "typeorm";
import * as qrCode from "qrcode";

@Injectable()
export class TFAService{
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService) {}

	async requestNewSecret(accessToken: string) : Promise<any> {
		try {
			const USER_DATA = await this.userService.getMyUserData(accessToken);
			const DATA = await this.userRepository.find({ where: {intraName: USER_DATA.intraName} });
			if (DATA[0].tfaSecret != null)
				return { qr: null, secretKey: null };
			DATA[0].tfaSecret = authenticator.generateSecret();
			const ACCOUNT_NAME = USER_DATA.name;
			const SERVICE = "PONGSH"
			const OTP_PATH = authenticator.keyuri(ACCOUNT_NAME, SERVICE, DATA[0].tfaSecret);
			const IMAGE_URL = await qrCode.toDataURL(OTP_PATH);
			await this.userRepository.save(DATA[0]);
			return { qr : IMAGE_URL, secretKey : DATA[0].tfaSecret };
		} catch {
			return { qr: null, secretKey: null };
		}
	}

	async validateOTP(accessToken: string, otp: string) : Promise<any> {
		try {
			const DATA = await this.userService.getMyUserData(accessToken);
			return { boolean: authenticator.verify({
				token : otp, 
				secret : DATA.tfaSecret,
			}) };
		} catch {
			return { boolean: false};
		}
	}
}