import { TfaDTO, TfaValidateDTO } from "src/dto/tfa.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/users.entity";
import { UserDTO } from "src/dto/user.dto";
import { ErrorDTO } from "src/dto/error.dto";
import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { Repository } from "typeorm";
import * as qrCode from "qrcode";
import * as fs from 'fs';

@Injectable()
export class TFAService{
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService, private readonly mailerService: MailerService) {}

	async requestNewSecret(accessToken: string) : Promise<TfaDTO> {
		try {
			const USER_DATA = await this.userService.getMyUserData(accessToken);
			const DATA = await this.userRepository.findOne({ where: {intraName: USER_DATA.intraName} });
			if (DATA.tfaSecret != null)
				return new TfaDTO(null, null);
			DATA.tfaSecret = authenticator.generateSecret();
			const OTP_PATH = authenticator.keyuri(USER_DATA.intraName, "PONGSH", DATA.tfaSecret);
			const IMAGE_URL = await qrCode.toDataURL(OTP_PATH);
			await this.userRepository.save(DATA);
			return new TfaDTO(IMAGE_URL, DATA.tfaSecret);
		} catch {
			return new TfaDTO(null, null);
		}
	}

	async forgotSecret(accessToken: string): Promise<ErrorDTO> {
		const INTRA_DATA = await this.userService.getMyIntraData(accessToken);
		if (INTRA_DATA.error !== undefined)
			return new ErrorDTO(INTRA_DATA.error);
		const USER_DATA = await this.userRepository.findOne({ where: {intraName: INTRA_DATA.name} });
		if (USER_DATA.tfaSecret === null)
			return new ErrorDTO("Invalid request - You don't have a 2FA setup");
		await this.deleteSecret(accessToken);
		const TFA = await this.requestNewSecret(accessToken);
		const DECODED = Buffer.from(TFA.qr.split(",")[1], 'base64');
		fs.writeFile(USER_DATA.intraName + "-QR.png", DECODED, {encoding:'base64'}, function(err) {});
		await this.mailerService.sendMail({
				to: INTRA_DATA.email,
				from: process.env.GOOGLE_EMAIL,
				subject: "2FA Secret Recovery",
				html: "<h1>New 2FA Secret Requested!</h1><p>Your new 2FA secret is <b>" + USER_DATA.tfaSecret + "</b></p>",
				attachments: [{
						filename: USER_DATA.intraName + "-QR.png",
						path: USER_DATA.intraName + "-QR.png",
					}]
		});
		fs.unlink(USER_DATA.intraName + "-QR.png", () => {});
	}

	async validateOTP(accessToken: string, otp: string) : Promise<TfaValidateDTO> {
		try {
			let userData = await this.userService.getMyUserData(accessToken);
			userData = await this.userRepository.findOne({ where: {intraName: userData.intraName} });
			return new TfaValidateDTO(authenticator.verify({ token : otp, secret : userData.tfaSecret}));
		} catch {
			return new TfaValidateDTO(false);
		}
	}

	async deleteSecret(accessToken: string) : Promise<UserDTO> {
		const DATA = await this.userRepository.findOne({ where: {intraName: (await this.userService.getMyUserData(accessToken)).intraName} });
		DATA.tfaSecret = null;
		return this.userService.hideData(await this.userRepository.save(DATA));
	}
}