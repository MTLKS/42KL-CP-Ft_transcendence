import { FriendshipService } from "src/friendship/friendship.service";
import { Friendship } from "src/entity/friendship.entity";
import { Channel } from "src/entity/channel.entity";
import { Message } from "src/entity/message.entity";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "src/entity/member.entity";
import { ChannelDTO } from "src/dto/chat.dto";
import { ErrorDTO } from "src/dto/error.dto";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, @InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Message) private messageRepository: Repository<Message>, @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, private userService: UserService, private friendshipService: FriendshipService) { }

	// Used to connect to own room
	async userConnect(client: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return ;
		let dmRoom = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false } });
		if (dmRoom === null)
			dmRoom = await this.channelRepository.save(new Channel(USER_DATA, USER_DATA.intraName, true, null, false));
		client.join(dmRoom.channelId);
	}

	// Used to send message to a room
	async message(client: any, server: any, intraName: string, message: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_ROOM = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		if (message === undefined || intraName === undefined)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid body - body must include intraName(string) and message(string)" });
		if (intraName === USER_DATA.intraName)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid intraName - you no friends so you DM yourself?" });
		if (message.length > 1024 || message.length < 1)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid message - message is must be between 1-1024 characters only" });
		const CHANNEL = await this.channelRepository.findOne({ where: { channelName: intraName, owner: { intraName: intraName }, isPrivate: true, password: null, isRoom: false }, relations: ['owner'] });
		if (CHANNEL === null)
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid channelId - channel is not found" } );
		
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: [{sender: {intraName: USER_DATA.intraName}, receiver: {intraName: intraName}}, {sender: {intraName: intraName}, receiver: {intraName: USER_DATA.intraName}}] });
		if (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED")
			return server.to(MY_ROOM.channelId).emit("message", { error: "Invalid friendhsip - you are not friends with this user" });
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		const NEW_MESSAGE = new Message(MY_CHANNEL, CHANNEL, false, message, new Date().toISOString());
		await this.messageRepository.save(NEW_MESSAGE);

		let member = await this.memberRepository.findOne({ where: { user: { intraName: USER_DATA.intraName }, channel: CHANNEL } });
		if (member === null)
			await this.memberRepository.save(new Member(USER_DATA, CHANNEL, true, false, false, new Date().toISOString()));
		else {
			member.lastRead = new Date().toISOString();
			await this.memberRepository.save(member);
		}
		server.to(CHANNEL.channelId).emit("message", this.userService.hideData(NEW_MESSAGE));
	}

	// Marks a message as read
	async read(client: any, server: any, channelId: number): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		if (MY_CHANNEL === null)
			return;
		const FRIEND_CHANNEL = await this.channelRepository.findOne({ where: { channelId: channelId, isRoom: false }, relations: ['owner'] });
		if (FRIEND_CHANNEL === null)
			return server.to(MY_CHANNEL.channelId).emit("read", { error: "Invalid channelId - channel is not found" });
		if ((await this.friendshipService.getFriendshipStatus(client.handshake.headers.authorization, FRIEND_CHANNEL.owner.intraName)).status !== "ACCEPTED")
			return server.to(MY_CHANNEL.channelId).emit("read", { error: "Invalid channelId - you are not friends with this user" });
		const MY_MEMBER = await this.memberRepository.findOne({ where: { user: { intraName: USER_DATA.intraName }, channel: FRIEND_CHANNEL }, relations: ['user', 'channel'] });
		MY_MEMBER.lastRead = new Date().toISOString();
		await this.memberRepository.save(MY_MEMBER);
		server.to(MY_CHANNEL.channelId).emit("read", this.userService.hideData(MY_MEMBER));
	}

	// Checks whether user is typing
	async typing(client: any, server: any, intraName: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_ROOM = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		if (intraName === USER_DATA.intraName)
			return server.to(MY_ROOM.channelId).emit("typing", { error: "Invalid intraName - you no friends so you DM yourself?" });
		const CHANNEL = await this.channelRepository.findOne({ where: { channelName: intraName, owner: { intraName: intraName }, isPrivate: true, password: null, isRoom: false }, relations: ['owner'] });
		if (CHANNEL === null)
			return server.to(MY_ROOM.channelId).emit("typing", { error: "Invalid channelId - channel is not found" } );
		
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: [{sender: {intraName: USER_DATA.intraName}, receiver: {intraName: intraName}}, {sender: {intraName: intraName}, receiver: {intraName: USER_DATA.intraName}}] });
		if (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED")
			return server.to(MY_ROOM.channelId).emit("typing", { error: "Invalid friendhsip - you are not friends with this user" });
		await this.friendshipRepository.save(FRIENDSHIP)
		server.to(CHANNEL.channelId).emit("typing", { intraName: USER_DATA.intraName });
	}

	// Retrives user's member data
	async getMyMemberData(accessToken: string, channelId: number): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const MEMBER_DATA = await this.memberRepository.findOne({ where: { user: { intraName: USER_DATA.intraName }, channel: { channelId: channelId } }, relations: ['user', 'channel', 'channel.owner'] });
		return MEMBER_DATA === null ? new ErrorDTO("Invalid channelId - member is not found in that channelId") : this.userService.hideData(MEMBER_DATA);
	}

	// Retrives all DM of the user
	async getAllDMChannel(accessToken: string): Promise<[ChannelDTO]> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const FRIENDSHIPS = await this.friendshipService.getFriendship(accessToken);
		const FRIENDS = FRIENDSHIPS.filter(friendship => (friendship.sender.intraName === USER_DATA.intraName || friendship.receiver.intraName === USER_DATA.intraName) && friendship.status === "ACCEPTED" ).flatMap(friendship => [friendship.sender.intraName, friendship.receiver.intraName]).filter(intraName => intraName !== USER_DATA.intraName);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: {owner: {intraName: USER_DATA.intraName }}, relations: ['owner'] });
		let channel = [];
		for (let friend of FRIENDS) {
			const CHANNEL = await this.channelRepository.findOne({ where: { owner: { intraName: friend } }, relations: ['owner'] });
			if (CHANNEL === null)
				continue;
			const LAST_MESSAGE = await this.messageRepository.findOne({ where: [{ receiverChannel: MY_CHANNEL, senderChannel: CHANNEL }, { receiverChannel: CHANNEL, senderChannel: MY_CHANNEL }], order: { timeStamp: "DESC" } });
			const MEMBER = await this.memberRepository.findOne({ where: { user: { intraName: USER_DATA.intraName }, channel: CHANNEL }, relations: ['user'] });
			CHANNEL["newMessage"] = LAST_MESSAGE === null ? false : LAST_MESSAGE.timeStamp > MEMBER.lastRead;
			CHANNEL.owner.accessToken = LAST_MESSAGE === null ? new Date(-8640000000000000).toISOString() : LAST_MESSAGE.timeStamp;
			channel.push(CHANNEL);
		}
		return this.userService.hideData(channel.sort((a, b) => new Date(b.owner.accessToken).getTime() - new Date(a.owner.accessToken).getTime()));
	}

	// Retrives all messages from a DM
	async getMyDMMessages(accessToken: string, channelId: number, perPage: number, page: number): Promise<any> {
		if (perPage === undefined)
			perPage = 100;
		if (page === undefined)
			page = 1;
		if (channelId === undefined)
			return new ErrorDTO("Invalid body - body must include channelId(number)");
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { owner: { intraName: USER_DATA.intraName }, isRoom: true }, relations: ['owner'] });
		const FRIEND_CHANNEL = await this.channelRepository.findOne({ where: { channelId: channelId }, relations: ['owner'] });
		if (FRIEND_CHANNEL === null)
			return new ErrorDTO("Invalid channelId - channel is not found");
		if ((await this.friendshipService.getFriendshipStatus(accessToken, FRIEND_CHANNEL.owner.userName)).status !== "ACCEPTED")
			return new ErrorDTO("Invalid channelId - you are not friends with this user");
		const MESSAGES = await this.messageRepository.find({ where: [{ receiverChannel: MY_CHANNEL, senderChannel: FRIEND_CHANNEL }, { receiverChannel: { channelId: channelId }, senderChannel: MY_CHANNEL }], relations: ['senderChannel', 'receiverChannel', 'senderChannel.owner', 'receiverChannel.owner'] });
		return this.userService.hideData(MESSAGES.slice(MESSAGES.length - (page * perPage), MESSAGES.length - ((page - 1) * perPage)));
	}

	// Creates a new room
	async createRoom(accessToken: string, channelName: string, isPrivate: boolean, password: string): Promise<any> {
		if (channelName === undefined || isPrivate === undefined || password === undefined)
			return { error: "Invalid body - body must include channelName(string), isPrivate(boolean) and password(null | string)" };
		if (password !== null) {
			if (password.length < 1 || password.length > 16)
				return { error: "Invalid password - password must be between 1-16 characters" };
			password = await bcrypt.hash(password, await bcrypt.genSalt(10));
		}
		if (channelName.length < 1 || channelName.length > 16)
			return { error: "Invalid channelName - channelName must be between 1-16 characters" };
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const ROOM = new Channel(USER_DATA, channelName, isPrivate, password, true);
		await this.channelRepository.save(ROOM);
		await this.memberRepository.save(new Member(USER_DATA, ROOM, true, false, false, new Date().toISOString()));
		return this.userService.hideData(ROOM);
	}

	// Updates room settings
	async updateRoom(accessToken: string, channelId: number, channelName: string, isPrivate: boolean, oldPassword: string, newPassword: string): Promise<any> {
		if (channelName === undefined || isPrivate === undefined || newPassword === undefined)
			return { error: "Invalid body - body must include channelName(string), isPrivate(boolean) and password(null | string)" };
		if (newPassword !== null) {
			if (newPassword.length < 1 || newPassword.length > 16)
				return { error: "Invalid password - password must be between 1-16 characters" };
			newPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
		}
		if (channelName.length < 1 || channelName.length > 16)
			return { error: "Invalid channelName - channelName must be between 1-16 characters" };
		// const USER_DATA = await this.userService.getMyUserData(accessToken);
		// const ROOM = await this.channelRepository.findOne({ where: {channelId: channelId, owner: {userName: USER_DATA.intraName}}, relations: ['owner'] });
	}

	// Deletes a room
	async deleteRoom(accessToken: string, channelId: number): Promise<any> {
	}
}