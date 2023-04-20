import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";

const	GREEN	=	"\x1b[32m";
const	RED		= "\x1b[31m";
const	RESET = "\x1b[0m";

@Injectable()
export class AuthGuard implements CanActivate
{
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	// Check if the access token is valid with the database
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const REQUEST = context.switchToHttp().getRequest();
		const AUTH_CODE = REQUEST.header('Authorization');
		console.log("Authorization code:", AUTH_CODE);
		try {
			const ACCESS_TOKEN = CryptoJS.AES.decrypt(AUTH_CODE, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
			console.log("accessToken:", ACCESS_TOKEN);
			const DATA = await this.userRepository.find({ where: {accessToken: ACCESS_TOKEN} })
			console.log(DATA.length !== 0 ? GREEN + "Authorization is valid" + RESET : RED + "Authorization is invalid" + RESET);
			return DATA.length !== 0
		} catch {
			console.log(RED + "Authorization is invalid" + RESET);
			return false;
		}
	}
}