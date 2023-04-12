import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate
{
	/*
		This guard will be placed in all routes that is accessable only by authenticate user.
		for example ('user'). When the user want to access these sites, they need to send the request
		with the header storing their access token
		
		This guard will check the http header for following
			Token present
			Token inside database
	*/
	//TODO : search for access token inside database
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		console.log("Authorization: ", request.header('Authorization'));
		// if (!request.header.authorization)
		// 	return (false);
		return (true);
	}
}