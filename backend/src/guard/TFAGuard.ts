import { CanActivate, Injectable } from "@nestjs/common";
import { AuthGuard } from "./AuthGuard";
import { ExecutionContext } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { TFAService } from "src/tfa/tfa.service";

@Injectable()
export class TFAGuard implements CanActivate {
	constructor(@InjectRepository(User) private userRepository: Repository<User>, private tfaService: TFAService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (await new AuthGuard(this.userRepository).canActivate(context) === false)
			return false;
		const REQUEST = context.switchToHttp().getRequest();
		return await this.tfaService.validateOTP(REQUEST.header('Authorization'), REQUEST.header('TFA'));
	}
}