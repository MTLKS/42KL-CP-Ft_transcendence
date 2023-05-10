import { CanActivate, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExecutionContext } from "@nestjs/common";
import { TFAService } from "src/tfa/tfa.service";
import { User } from "src/entity/user.entity";
import { AuthGuard } from "./AuthGuard";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";

@Injectable()
export class TFAGuard implements CanActivate {
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private tfaService: TFAService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (await new AuthGuard(this.userRepository).canActivate(context) === false)
			return false;
		const REQUEST = context.switchToHttp().getRequest();
		let authCode: string;
		try {
			authCode = REQUEST.header('Authorization');
		} catch {
			authCode = REQUEST.handshake.headers.authorization;
		}
		const USER_DATA = await this.userRepository.findOne({ where: {accessToken: CryptoJS.AES.decrypt(authCode, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)} });
		return USER_DATA.tfaSecret === null ? true : (await this.tfaService.validateOTP(REQUEST.header('Authorization'), REQUEST.header('TFA'))).boolean;
	}
}