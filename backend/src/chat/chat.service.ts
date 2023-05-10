import { Friendship } from "src/entity/friendship.entity";
import { Channel } from "src/entity/channel.entity";
import { Message } from "src/entity/message.entity";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "src/entity/member.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, @InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Message) private messageRepository: Repository<Message>, @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, private userService: UserService) {}

	// Used to connect to own room
	async userConnect(client: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return { "error": USER_DATA.error };
		const DM_ROOM = await this.channelRepository.find({ where: {channelName: USER_DATA.intraName, isRoom: false} });
		if (DM_ROOM.length === 0) {
			const NEW_ROOM = await this.channelRepository.save(new Channel(USER_DATA.intraName, USER_DATA.intraName, true, null, false));
			await this.memberRepository.save(new Member(NEW_ROOM.channelId, USER_DATA.intraName, true, false, false, new Date().toISOString()));
		} else {
			client.join(DM_ROOM[0].channelId);
			client.emit("message", { intraName: "Server", message: `${USER_DATA.intraName} has joined the room` } );
		}
	}

	// Used to send message to a room
	async sendMessage(client: any, server: any, intraName: string, message: string): Promise<any> {
		if (message === undefined || intraName === undefined)
			return {"error": "Invalid body - body must include intraName(string) and message(string)"};
		if (message.length > 1024 || message.length < 1)
			return {"error": "Invalid message - message is must be 1-1024 characters only"};
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA === undefined)
			return {"error": "Invalid intraName - intraName is not found"};
		const CHANNEL = await this.channelRepository.find({ where: {channelName: intraName, ownerIntraName: intraName, isPrivate: true, password: null, isRoom: false} });
		if (CHANNEL.length === 0)
			return {"error": "Invalid channel - channel is not found"};
		const FRIENDSHIP = [...await this.friendshipRepository.find({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: intraName} }), ...await this.friendshipRepository.find({ where: {senderIntraName: intraName, receiverIntraName: USER_DATA.intraName} })];
		if (FRIENDSHIP.length === 0 || FRIENDSHIP[0].status !== "ACCEPTED")
			return {"error": "Invalid friendhsip - You are not friends with this user"};
		await this.messageRepository.save(new Message(USER_DATA.intraName, CHANNEL[0].channelId, true, message, new Date().toISOString()));
		server.to(CHANNEL[0].channelId).emit("message", message);
	}

	// Get all DM's between the user and intraName
	async getMyDM(accessToken: string, intraName: string): Promise<any> {
		if (intraName === undefined)
			return { error: "Invalid body - body must include intraName(string)" };
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		if (intraName === USER_DATA.intraName)
			return { error: "Invalid intraname - you cannot DM yourself" };
		if (USER_DATA.error !== undefined)
			return USER_DATA;
		const CHANNEL = await this.channelRepository.find({ where: [{ownerIntraName: USER_DATA.intraName, isRoom: false}, {ownerIntraName: intraName, isRoom: false}] });
		if (CHANNEL.length !== 2)
			return { error: "Invalid intraname - no DM found with defined intraName" };
		return await this.messageRepository.find({ where: [{channelId: CHANNEL[0].channelId}, {channelId: CHANNEL[1].channelId}] });
	}
}