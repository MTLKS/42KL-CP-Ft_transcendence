import { ApiProperty } from "@nestjs/swagger";
import { UserDataDTO } from "./user.dto";

export class FriendshipDTO {
	constructor(sender: UserDataDTO, receiver: UserDataDTO, status: string) {
		this.sender = sender;
		this.receiver = receiver;
		this.status = status;
	}

	@ApiProperty({ example: {
		intraId: 111856,
		userName: "Doughnuts",
		intraName: "schuah",
		elo: 9999,
		accessToken: "HIDDEN",
		avatar: "http://localhost:3000/user/avatar/schuah",
		tfaSecret: "HIDDEN",
		winning: true
	}})
	sender: UserDataDTO;

	@ApiProperty({ example: {
		intraId: 111856,
		userName: "Doughnuts",
		intraName: "schuah",
		elo: 9999,
		accessToken: "HIDDEN",
		avatar: "http://localhost:3000/user/avatar/schuah",
		tfaSecret: "HIDDEN",
		winning: true
	}})
	receiver: UserDataDTO;

	@ApiProperty({ example: "PENDING | ACCEPTED | BLOCKED" })
	status: string;
}

export class PostFriendshipBodyDTO {
	@ApiProperty({ example: "schuah" })
	receiverIntraName: string;

	@ApiProperty({ example: "PENDING | ACCEPTED | BLOCKED" })
	status: string;
}