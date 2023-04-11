import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import * as CryptoJS from 'crypto-js';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

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
			let accessToken = CryptoJS.AES.decrypt(AUTH_CODE, process.env.ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
			console.log("ACCESS_TOKEN:", accessToken);
			const DATA = await this.userRepository.find({ where: {accessToken} })
			console.log("Guard End");
			return (DATA.length !== 0)
		} catch {
			console.log("Authorization is invalid");
			return (false);
		}
	}
}