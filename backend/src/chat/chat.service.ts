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
import { Repository, In } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, @InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Message) private messageRepository: Repository<Message>, @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, private userService: UserService, private friendshipService: FriendshipService) { }

	// Used to connect to own channel
	async userConnect(client: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return ;
		let dmRoom = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false } });
		if (dmRoom === null)
			dmRoom = await this.channelRepository.save(new Channel(USER_DATA, USER_DATA.intraName, true, null, false, false));
		client.join(dmRoom.channelId);
	}

	// Used to send message to a channel
	async message(client: any, server: any, channelId: number, message: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		if (message === undefined || channelId === undefined)
			return server.to(MY_CHANNEL.channelId).emit("message", new ErrorDTO("Invalid body - body must include channelId(string) and message(string)"));
		
		if (channelId === MY_CHANNEL.channelId)
			return server.to(MY_CHANNEL.channelId).emit("message", new ErrorDTO("Invalid channelId - you no friends so you DM yourself?"));
		if (message.length > 1024 || message.length < 1)
			return server.to(MY_CHANNEL.channelId).emit("message", new ErrorDTO("Invalid message - message is must be between 1-1024 characters only"));
		
		const CHANNEL = await this.channelRepository.findOne({ where: { channelId: channelId }, relations: ['owner'] });
		if (CHANNEL === null)
			return server.to(MY_CHANNEL.channelId).emit("message", new ErrorDTO("Invalid channelId - channel is not found"));
		
		const NEW_MESSAGE = new Message(MY_CHANNEL, CHANNEL, CHANNEL.isRoom, message, new Date().toISOString());
		if (CHANNEL.isRoom === true) {
			await this.messageRepository.save(NEW_MESSAGE);
			const MEMBERS = await this.memberRepository.find({ where: { channel: { channelId: CHANNEL.channelId } }, relations: ['user', 'channel'] });
			for (let member of MEMBERS) {
				const MEMBER_CHANNEL = await this.channelRepository.findOne({ where: { channelName: member.user.intraName, isRoom: false }, relations: ['owner'] });
				server.to(MEMBER_CHANNEL.channelId).emit("message", this.userService.hideData(NEW_MESSAGE));
			}
		} else {
			const FRIENDSHIP = await this.friendshipService.getFriendshipStatus(client.handshake.headers.authorization, CHANNEL.owner.intraName)
			if (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED")
				return server.to(MY_CHANNEL.channelId).emit("message", new ErrorDTO("Invalid friendhsip - you are not friends with this user"));
			await this.messageRepository.save(NEW_MESSAGE);
			const MEMBER = await this.getMyMemberData(client.handshake.headers.authorization, CHANNEL.channelId)
			MEMBER.lastRead = new Date().toISOString();
			await this.memberRepository.save(MEMBER);
			server.to(CHANNEL.channelId).emit("message", this.userService.hideData(NEW_MESSAGE));
		}
	}

	// Marks a message as read
	async read(client: any, server: any, channelId: number): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		const CHANNEL = await this.channelRepository.findOne({ where: { channelId: channelId, isRoom: false }, relations: ['owner'] });
		if (CHANNEL === null)
			return server.to(MY_CHANNEL.channelId).emit("read", new ErrorDTO("Invalid channelId - channel is not found"));
		
		const MY_MEMBER = await this.getMyMemberData(client.handshake.headers.authorization, channelId)
		if (MY_MEMBER.error !== undefined)
			return server.to(MY_CHANNEL.channelId).emit("read", new ErrorDTO("Invalid channelId - you are not a member of this channel"));
		if (CHANNEL.isRoom === false) {
			const FRIENDSHIP = await this.friendshipService.getFriendshipStatus(client.handshake.headers.authorization, CHANNEL.owner.intraName);
			if (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED")
				return server.to(MY_CHANNEL.channelId).emit("read", new ErrorDTO("Invalid channelId - you are not a member of this channel"));
		}
		MY_MEMBER.lastRead = new Date().toISOString();
		await this.memberRepository.save(MY_MEMBER);
		server.to(MY_CHANNEL.channelId).emit("read", this.userService.hideData(MY_MEMBER));
	}

	// Ping the channel that the user is typing to that channel
	async typing(client: any, server: any, channelId: number): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		if (channelId === MY_CHANNEL.channelId)
			return server.to(MY_CHANNEL.channelId).emit("typing", new ErrorDTO("Invalid channelId - you no friends so you DM yourself?"));
		const CHANNEL = await this.channelRepository.findOne({ where: { channelId: channelId }, relations: ['owner'] });
		if (CHANNEL === null)
			return server.to(MY_CHANNEL.channelId).emit("typing", new ErrorDTO("Invalid channelId - channel is not found" ));
		
		const MY_MEMBER = await this.getMyMemberData(client.handshake.headers.authorization, channelId);
		if (MY_MEMBER.error !== undefined)
			return server.to(MY_CHANNEL.channelId).emit("read", new ErrorDTO("Invalid channelId - you are not a member of this channel"));
		if (CHANNEL.isRoom === false) {
			const FRIENDSHIP = await this.friendshipService.getFriendshipStatus(client.handshake.headers.authorization, CHANNEL.owner.intraName);
			if (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED")
				return server.to(MY_CHANNEL.channelId).emit("typing", new ErrorDTO("Invalid channelId - you are not a member of this channel"));
		}
		
		const MEMBERS = await this.memberRepository.find({ where: { channel: { channelId: CHANNEL.channelId } }, relations: ['user', 'channel'] });
		for (let member of MEMBERS) {
			const MEMBER_CHANNEL = await this.channelRepository.findOne({ where: { channelName: member.user.intraName, isRoom: false }, relations: ['owner'] });
			server.to(MEMBER_CHANNEL.channelId).emit("typing", { userName: USER_DATA.userName });
		}
	}

	// Retrives user's member data of that channel
	async getMyMemberData(accessToken: string, channelId: number): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const MEMBER_DATA = await this.memberRepository.findOne({ where: { user: { intraName: USER_DATA.intraName }, channel: { channelId: channelId } }, relations: ['user', 'channel', 'channel.owner'] });
		return MEMBER_DATA === null ? new ErrorDTO("Invalid channelId - member is not found in that channelId") : this.userService.hideData(MEMBER_DATA);
	}

	// Retrives all channel of the user
	async getAllChannel(accessToken: string): Promise<[ChannelDTO]> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const MY_MEMBERS = await this.memberRepository.find({ where: { user: { intraName: USER_DATA.intraName } }, relations: ['user', 'channel', 'channel.owner'] });
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { channelName: USER_DATA.intraName, isRoom: false }, relations: ['owner'] });
		let channel = [];
		for (let member of MY_MEMBERS) {
			const MEMBERS = await this.memberRepository.find({ where: { channel: { channelId: member.channel.channelId } }, relations: ['user', 'channel'] });
			const CHANNEL_ID = MEMBERS.map(member => member.channel.channelId);
			const LAST_MESSAGE = await this.messageRepository.findOne({ where: [{ receiverChannel: { channelId: MY_CHANNEL.channelId}, senderChannel: { channelId: In(CHANNEL_ID) } }, { receiverChannel: { channelId: In(CHANNEL_ID) }, senderChannel: { channelId: MY_CHANNEL.channelId } }], order: { timeStamp: "DESC" } });
			member.channel.newMessage  = LAST_MESSAGE === null ? false : LAST_MESSAGE.timeStamp > member.lastRead;
			member.channel.owner.accessToken = LAST_MESSAGE === null ? new Date(-8640000000000000).toISOString() : LAST_MESSAGE.timeStamp;
			channel.push(member.channel);
		}
		return this.userService.hideData(channel.sort((a, b) => new Date(b.owner.accessToken).getTime() - new Date(a.owner.accessToken).getTime()));
	}

	// Retrives all messages from a channel
	async getAllMessageFromChannel(accessToken: string, channelId: number, perPage: number = 100, page: number = 1): Promise<any> {
		perPage = Number(perPage);
		page = Number(page);
		if (channelId === undefined)
			return new ErrorDTO("Invalid body - body must include channelId(number)");
		
		const CHANNEL = await this.channelRepository.findOne({ where: { channelId: channelId }, relations: ['owner'] });
		if (CHANNEL.isRoom === true ) {
			const FRIENDSHIP = await this.friendshipService.getFriendshipStatus(accessToken, CHANNEL.owner.intraName)
			if (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED")
				return new ErrorDTO("Invalid channelId - you are not friends with this user");
		}
		const MY_MEMBER = await this.getMyMemberData(accessToken, channelId);
		if (MY_MEMBER.error !== undefined)
			return new ErrorDTO(MY_MEMBER.error);
		const MY_CHANNEL = await this.channelRepository.findOne({ where: { channelName: MY_MEMBER.user.intraName, isRoom: false }, relations: ['owner'] });
		const MESSAGES = await this.messageRepository.find({ where: [{ receiverChannel: { channelId: MY_CHANNEL.channelId}, senderChannel: { channelId: channelId } }, { receiverChannel: { channelId: channelId }, senderChannel: { channelId: MY_CHANNEL.channelId } }], relations: ['senderChannel', 'receiverChannel', 'senderChannel.owner', 'receiverChannel.owner'] });
		return this.userService.hideData(MESSAGES.length - (page * perPage) < 0 ? MESSAGES.slice(0, Math.max(0, perPage + MESSAGES.length - (page * perPage))) : MESSAGES.slice(MESSAGES.length - (page * perPage), MESSAGES.length - ((page - 1) * perPage)));
	}

	// Creates a new room
	async createRoom(accessToken: string, channelName: string, isPrivate: boolean, password: string): Promise<any> {
		if (channelName === undefined || isPrivate === undefined || password === undefined)
			return new ErrorDTO("Invalid body - body must include channelName(string), isPrivate(boolean) and password(null | string)");
		if (isPrivate === true && password !== null)
			return new ErrorDTO("Invalid body - password must be null if isPrivate is true");
		if (password !== null) {
			if (password.length < 1 || password.length >= 16)
				return new ErrorDTO("Invalid password - password must be between 1-16 characters");
			password = await bcrypt.hash(password, await bcrypt.genSalt(10));
		}
		if (channelName.length < 1 || channelName.length >= 16)
			return new ErrorDTO("Invalid channelName - channelName must be between 1-16 characters");
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const ROOM = new Channel(USER_DATA, channelName, isPrivate, password, true, false);
		await this.channelRepository.save(ROOM);
		await this.memberRepository.save(new Member(USER_DATA, ROOM, true, false, false, new Date().toISOString()));
		return this.userService.hideData(ROOM);
	}

	// Adds a user to a room
	async addMember(accessToken: string, channelId: number, intraName: string, isAdmin: boolean, isBanned: boolean, isMuted: boolean, password: string): Promise<any> {
		if (channelId === undefined || intraName === undefined || isAdmin === undefined || isBanned === undefined || isMuted === undefined || password === undefined)
			return new ErrorDTO("Invalid body - body must include channelId(number), intraName(string), isAdmin(boolean), isBanned(boolean), isMuted(boolean) and password(null | string)");
		const MY_MEMBER = await this.getMyMemberData(accessToken, channelId);
		if (MY_MEMBER.error !== undefined) {
			const USER_DATA = await this.userService.getMyUserData(accessToken);
			if (USER_DATA.intraName != intraName)
				return new ErrorDTO("Invalid channelId - requires admin privileges");
			MY_MEMBER["isAdmin"] = false;
		}

		const CHANNEL = await this.channelRepository.findOne({ where: { channelId: channelId }, relations: ['owner'] });
		if (CHANNEL.isRoom === false)
			return new ErrorDTO("Invalid channelId - this channel is not a room");			
		const FRIEND_DATA = await this.userService.getUserDataByIntraName(accessToken, intraName);
		if (FRIEND_DATA.error !== undefined)
			return new ErrorDTO(FRIEND_DATA.error);
		const FRIENDSHIP = await this.friendshipService.getFriendshipStatus(accessToken, FRIEND_DATA.intraName);
		if (FRIEND_DATA.intraName !== intraName && (FRIENDSHIP === null || FRIENDSHIP.status !== "ACCEPTED"))
			return new ErrorDTO("Invalid intraName - you are not friends with this user");
		if (MY_MEMBER.isAdmin === false && (isAdmin === true || isBanned === true || isMuted === true || FRIEND_DATA.intraName !== intraName))
			return new ErrorDTO("Invalid channelId - requires admin privileges");
		
		if (CHANNEL.isPrivate === true && MY_MEMBER.isAdmin === false)
			return new ErrorDTO("Invalid channelId - requires admin privileges");
		else if (CHANNEL.password !== null && MY_MEMBER.isAdmin === false && (password === null || await bcrypt.compare(password, CHANNEL.password) === false))
			return new ErrorDTO("Invalid password - password does not match");
		
		const MEMBER = await this.memberRepository.findOne({ where: { user: { intraName: intraName }, channel: { channelId: channelId } } });
		if (MEMBER !== null)
			return new ErrorDTO("Invalid intraName - user is already a member of this channel");
		return this.userService.hideData(await this.memberRepository.save(new Member(FRIEND_DATA, CHANNEL, isAdmin, isBanned, isMuted, new Date().toISOString())));
	}

	// Updates room settings
	async updateRoom(accessToken: string, channelId: number, channelName: string, isPrivate: boolean, oldPassword: string, newPassword: string): Promise<any> {
		if (channelName === undefined || isPrivate === undefined || newPassword === undefined)
			return new ErrorDTO("Invalid body - body must include channelName(string), isPrivate(boolean) and password(null | string)");
		if (newPassword !== null) {
			if (newPassword.length < 1 || newPassword.length > 16)
				return new ErrorDTO("Invalid password - password must be between 1-16 characters");
			newPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
		}
		if (channelName.length < 1 || channelName.length > 16)
			return new ErrorDTO("Invalid channelName - channelName must be between 1-16 characters");
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const ROOM = await this.channelRepository.findOne({ where: {channelId: channelId, isRoom: true, owner: {userName: USER_DATA.userName}}, relations: ['owner'] });
		// TBC
	}
}