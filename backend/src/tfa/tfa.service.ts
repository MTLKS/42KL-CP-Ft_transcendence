import { MailerService } from "@nestjs-modules/mailer";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/users.entity";
import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { Repository } from "typeorm";
import * as qrCode from "qrcode";
import * as fs from 'fs';

@Injectable()
export class TFAService{
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private userService: UserService, private readonly mailerService: MailerService) {}

	async requestNewSecret(accessToken: string) : Promise<any> {
		try {
			const USER_DATA = await this.userService.getMyUserData(accessToken);
			const DATA = await this.userRepository.findOne({ where: {intraName: USER_DATA.intraName} });
			if (DATA.tfaSecret != null)
				return { qr: null, secretKey: null };
			DATA.tfaSecret = authenticator.generateSecret();
			const OTP_PATH = authenticator.keyuri(USER_DATA.userName, "PONGSH", DATA.tfaSecret);
			const IMAGE_URL = await qrCode.toDataURL(OTP_PATH);
			await this.userRepository.save(DATA);
			return { qr : IMAGE_URL, secretKey : DATA.tfaSecret };
		} catch {
			return { qr: null, secretKey: null };
		}
	}

	async forgotSecret(accessToken: string): Promise<any> {
		const INTRA_DATA = await this.userService.getMyIntraData(accessToken);
		if (INTRA_DATA.error !== undefined)
			return { error: INTRA_DATA.error };
		const USER_DATA = await this.userRepository.findOne({ where: {intraName: INTRA_DATA.name} });
		if (USER_DATA.tfaSecret === null)
			return { error: "Invalid request - You don't have a 2FA setup" };
		const qrCodeImageDataUrl = await qrCode.toDataURL(authenticator.keyuri(USER_DATA.userName, "PONGSH", USER_DATA.tfaSecret));
		const DECODED = Buffer.from(qrCodeImageDataUrl.split(",")[1], 'base64');
		fs.writeFile(USER_DATA.intraName + "-QR.png", DECODED, {encoding:'base64'}, function(err) {});
		await this.mailerService.sendMail({
				to: INTRA_DATA.email,
				from: process.env.GOOGLE_EMAIL,
				subject: "2FA Secret Recovery",
				html: "<h1>DON'T FORGET NEXT TIME!</h1><p>Your 2FA Secret is <b>" + USER_DATA.tfaSecret + "</b></p>",
				attachments: [
					{
						filename: USER_DATA.intraName + "-QR.png",
						path: USER_DATA.intraName + "-QR.png",
					}]
		});
		fs.unlink(USER_DATA.intraName + "-QR.png", (err) => {});
	}

	async validateOTP(accessToken: string, otp: string) : Promise<any> {
		try {
			let userData = await this.userService.getMyUserData(accessToken);
			userData = await this.userRepository.findOne({ where: {intraName: userData.intraName} });
			return { boolean: authenticator.verify({
				token : otp, 
				secret : userData.tfaSecret,
			}) };
		} catch {
			return { boolean: false};
		}
	}

	async deleteSecret(accessToken: string) : Promise<any> {
		const DATA = await this.userRepository.findOne({ where: {intraName: (await this.userService.getMyUserData(accessToken)).intraName} });
		DATA.tfaSecret = null;
		return await this.userRepository.save(DATA);
	}
}