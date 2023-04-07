import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
	getUserData(): any {
		return { name: "schuah" };
	}
}