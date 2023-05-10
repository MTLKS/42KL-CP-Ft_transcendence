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
			return;
		const DM_ROOM = await this.channelRepository.find({ where: {channelName: USER_DATA.intraName, isRoom: false} });
		if (DM_ROOM.length === 0) {
			const NEW_ROOM = await this.channelRepository.save(new Channel(USER_DATA.intraName, USER_DATA.intraName, true, null, false));
			await this.memberRepository.save(new Member(NEW_ROOM.channelId, USER_DATA.intraName, true, false, false, new Date().toISOString()));
		} else {
			client.join(DM_ROOM[0].channelId);
		}
	}

	// Used to send message to a room
	async message(client: any, server: any, intraName: string, message: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return;
		const MY_ROOM = await this.channelRepository.find({ where: {channelName: USER_DATA.intraName, isRoom: false} });
		if (message === undefined || intraName === undefined)
			return server.to(MY_ROOM[0].channelId).emit("message", { error: "Invalid body - body must include intraName(string) and message(string)" } );
		if (message.length > 1024 || message.length < 1)
			return server.to(MY_ROOM[0].channelId).emit("message", { error: "Invalid message - message is must be 1-1024 characters only" } );
		const CHANNEL = await this.channelRepository.find({ where: {channelName: intraName, ownerIntraName: intraName, isPrivate: true, password: null, isRoom: false} });
		if (CHANNEL.length === 0)
			return server.to(MY_ROOM[0].channelId).emit("message", { error: "Invalid channel - channel is not found" } );
		const FRIENDSHIP = [...await this.friendshipRepository.find({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: intraName} }), ...await this.friendshipRepository.find({ where: {senderIntraName: intraName, receiverIntraName: USER_DATA.intraName} })];
		if (FRIENDSHIP.length === 0 || FRIENDSHIP[0].status !== "ACCEPTED")
			return server.to(MY_ROOM[0].channelId).emit("message", { error: "Invalid friendhsip - You are not friends with this user" } );
		FRIENDSHIP[0].chatted = true;
		await this.friendshipRepository.save(FRIENDSHIP[0])
		await this.messageRepository.save(new Message(USER_DATA.intraName, CHANNEL[0].channelId, false, message, new Date().toISOString()));
		server.to(CHANNEL[0].channelId).emit("message", { intraName: USER_DATA.intraName, message: message } );
	}

	//  Retrives all messages from a DM
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

	async getAllDMChannel(accessToken: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		if (USER_DATA.error !== undefined)
			return USER_DATA;
		const FRIENDSHIPS = [...await this.friendshipRepository.find({ where: {senderIntraName: USER_DATA.intraName, status: "ACCEPTED"} }), ...await this.friendshipRepository.find({ where: {receiverIntraName: USER_DATA.intraName, status: "ACCEPTED"} })];
		const FRIENDS = FRIENDSHIPS.filter(friendship => friendship.senderIntraName === 'schuah' || friendship.receiverIntraName === 'schuah').flatMap(friendship => [friendship.senderIntraName, friendship.receiverIntraName]).filter(intraName => intraName !== 'schuah');
		return (await Promise.all(FRIENDS.map(friend => this.channelRepository.find({ where: { ownerIntraName: friend, isRoom: false } }) ))).flat();
	}
}