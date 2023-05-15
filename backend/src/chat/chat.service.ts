import { FriendshipService } from "src/friendship/friendship.service";
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
	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, @InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Message) private messageRepository: Repository<Message>, @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, private userService: UserService, private friendshipService: FriendshipService) {}

	// Used to connect to own room
	async userConnect(client: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		let dmRoom = await this.channelRepository.findOne({ where: {channelName: USER_DATA.intraName, isRoom: false} });
		if (dmRoom === null)
			dmRoom = await this.channelRepository.save(new Channel(USER_DATA, USER_DATA.intraName, true, null, false));
		client.join(dmRoom.channelId);
	}

	// Used to send message to a room
	async message(client: any, server: any, intraName: string, message: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_ROOM = await this.channelRepository.findOne({ where: {channelName: USER_DATA.intraName, isRoom: false}, relations: ['owner'] });
		if (message === undefined || intraName === undefined)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid body - body must include intraName(string) and message(string)" } );
		if (intraName === USER_DATA.intraName)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid intraName - you no friends so you DM yourself?" } );
		if (message.length > 1024 || message.length < 1)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid message - message is must be 1-1024 characters only" } );
		const CHANNEL = await this.channelRepository.findOne({ where: {channelName: intraName, owner: {intraName: intraName}, isPrivate: true, password: null, isRoom: false}, relations: ['owner'] });
		if (CHANNEL === null)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid intraName - channel is not found" } );
		
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: [{senderIntraName: USER_DATA.intraName, receiverIntraName: intraName}, {senderIntraName: intraName, receiverIntraName: USER_DATA.intraName}] });
		if (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED")
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid friendhsip - you are not friends with this user" } );
		await this.friendshipRepository.save(FRIENDSHIP)
		const NEW_MESSAGE = new Message(USER_DATA, CHANNEL.channelId, false, message, new Date().toISOString());
		await this.messageRepository.save(NEW_MESSAGE);

		let member = await this.memberRepository.findOne({ where: {user: { intraName: USER_DATA.intraName }, channelId: CHANNEL.channelId} });
		if (member === null)
			await this.memberRepository.save(new Member(USER_DATA, CHANNEL.channelId, true, false, false, new Date().toISOString()));
		else {
			member.lastRead = new Date().toISOString();
			await this.memberRepository.save(member);
		}
		NEW_MESSAGE.channelId = (await this.memberRepository.findOne({ where: {user: { intraName: intraName }} })).channelId
		server.to(CHANNEL.channelId).emit("message", this.userService.hideData(NEW_MESSAGE));
	}

	// Marks a message as read
	async read(client: any, server: any, channelId: number): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: {channelName: USER_DATA.intraName, isRoom: false}, relations: ['owner'] });
		if (MY_CHANNEL === null)
			return;
		const FRIEND_CHANNEL = await this.channelRepository.findOne({ where: {channelId: channelId, isRoom: false}, relations: ['owner'] });
		if (FRIEND_CHANNEL === null)
			return server.to(MY_CHANNEL.channelId).emit("read", { error: "Invalid channelId - channel is not found" } );
		if ((await this.friendshipService.getFriendshipStatus(client.handshake.headers.authorization, FRIEND_CHANNEL.owner.intraName)).status !== "ACCEPTED")
			return server.to(MY_CHANNEL.channelId).emit("read", { error: "Invalid channelId - channel is not found" } );
		const MY_MEMBER = await this.memberRepository.findOne({ where: {user: { intraName: USER_DATA.intraName }, channelId: FRIEND_CHANNEL.channelId}, relations: ['user'] });
		MY_MEMBER.lastRead = new Date().toISOString();
		await this.memberRepository.save(MY_MEMBER);
		server.to(MY_CHANNEL.channelId).emit("read", this.userService.hideData(MY_MEMBER) );
	}

	// Retrives user's member data
	async getMyMemberData(accessToken: string, channelId: number): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const MEMBER_DATA = await this.memberRepository.findOne({ where: {user: {intraName: USER_DATA.intraName }, channelId: channelId}, relations: ['user'] });
		return MEMBER_DATA === null ? { error: "Invalid channelId - member is not found in that channelId" } : MEMBER_DATA;
	} 

	// Retrives all DM of the user
	async getAllDMChannel(accessToken: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const FRIENDSHIPS = await this.friendshipService.getFriendship(accessToken);
		const FRIENDS = FRIENDSHIPS.filter(friendship => (friendship.senderIntraName === USER_DATA.intraName || friendship.receiverIntraName === USER_DATA.intraName) && friendship.status === "ACCEPTED" ).flatMap(friendship => [friendship.senderIntraName, friendship.receiverIntraName]).filter(intraName => intraName !== USER_DATA.intraName);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: {owner: {intraName: USER_DATA.intraName }}, relations: ['owner'] });
		let channel = [];
		for (let friend of FRIENDS) {
			const CHANNEL = await this.channelRepository.findOne({ where: {owner: {intraName: friend} }, relations: ['owner'] });
			if (CHANNEL === null)
				continue ;
			const LAST_MESSAGE = await this.messageRepository.findOne({ where: {channelId: MY_CHANNEL.channelId, user: { intraName: friend}}, order: {timeStamp: "DESC"} });
			const MEMBER = await this.memberRepository.findOne({ where: {user: {intraName: USER_DATA.intraName}, channelId: CHANNEL.channelId}, relations: ['user'] });
			CHANNEL["newMessage"] = LAST_MESSAGE === null ? false : LAST_MESSAGE.timeStamp > MEMBER.lastRead;
			channel.push(CHANNEL);
		}
		return this.userService.hideData(channel);
	}

	// Retrives all messages from a DM
	async getMyDMMessages(accessToken: string, channelId: number): Promise<any> {
		if (channelId === undefined)
			return { error: "Invalid body - body must include channelId(number)" };
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: {owner: {intraName: USER_DATA.intraName}}, relations: ['owner'] });
		if (MY_CHANNEL === null)
			return { error: "Invalid channelId - you are not in this channelId" };
		const FRIEND_CHANNEL = await this.channelRepository.findOne({ where: {channelId: channelId}, relations: ['owner'] });
		if (FRIEND_CHANNEL === null)
			return { error: "Invalid channelId - channel is not found" };
		if ((await this.friendshipService.getFriendshipStatus(accessToken, FRIEND_CHANNEL.owner.intraName)).status !== "ACCEPTED")
			return { error: "Invalid channelId - you are not in this channelId" };
		return await this.messageRepository.find({ where: [{channelId: MY_CHANNEL.channelId, user: {intraName: FRIEND_CHANNEL.owner.intraName}}, {channelId: channelId, user: {intraName: USER_DATA.intraName}}], relations: ['user'] });
	}
}