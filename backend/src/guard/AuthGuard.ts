import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import * as CryptoJS from 'crypto-js';
import { Repository } from "typeorm";
import * as dotenv from 'dotenv';

const	GREEN	=	"\x1b[32m";
const	RED		= "\x1b[31m";
const	BLUE = "\x1b[34m";
const	RESET = "\x1b[0m";

@Injectable()
export class AuthGuard implements CanActivate
{
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	// Check if the access token is valid with the database
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const REQUEST = context.switchToHttp().getRequest();
		const AUTH_CODE = REQUEST.header('Authorization');
		console.log(BLUE + "Authorization code:", AUTH_CODE + RESET);
		try {
			const ACCESS_TOKEN = CryptoJS.AES.decrypt(AUTH_CODE, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
			console.log(BLUE + "accessToken:", ACCESS_TOKEN + RESET);
			const USER = await this.userRepository.find({ where: {accessToken: ACCESS_TOKEN} })
			console.log(USER.length !== 0 ? GREEN + USER[0].intraName + " has connected" + RESET : RED + "Authorization is invalid" + RESET);
			return USER.length !== 0
		} catch {
			console.log(RED + "Authorization is invalid" + RESET);
			return false;
		}
	}
}
