import { Friendship } from "src/entity/friendship.entity";
import { Channel } from "src/entity/channel.entity";
import { Message } from "src/entity/message.entity";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "src/entity/member.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Socket } from "socket.io";

@Injectable()
export class ChatService {
	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, @InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Message) private messageRepository: Repository<Message>, @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, private userService: UserService) {}

	// Used to connect to own room
	async userConnect(client: any): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (USER_DATA.error !== undefined)
			return { "error": USER_DATA.error };
		const DM_ROOM = await this.channelRepository.find({ where: {channelName: USER_DATA.intraName, isRoom: false} });
		if (DM_ROOM.length === 0)
		{
			const NEW_ROOM = await this.channelRepository.save(new Channel(USER_DATA.intraName, USER_DATA.intraName, true, null, false));
			await this.memberRepository.save(new Member(NEW_ROOM.channelId, USER_DATA.intraName, true, false, false, new Date().toISOString()));
		} else {
			client.join(DM_ROOM[0].channelId);
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

	// async createNewRoom(accessToken: string, roomName: string, isPrivate: boolean, password: string): Promise<any> {
	// 	const SENDER = await this.userService.getMyUserData(accessToken);
	// 	for (var value of [roomName, isPrivate, password]) {
	// 		if (value === undefined)
	// 			return {"error": "Invalid body - body must include roomName(string), isPrivate(boolean), and password(nullable string)"};
	// 	}
	// 	if (roomName.length > 16 || roomName.length < 1)
	// 		return {"error": "Invalid roomName - roomName is must be 1-16 characters only"};
		
	// 	const SAVED_CHANNEL = await this.channelRepository.save(new Channel(roomName, SENDER.intraName, isPrivate, password, true, null));
	// 	await this.memberRepository.save(new Member(SAVED_CHANNEL.channelId, SENDER.userName, true, false, false, new Date().toISOString()));
	// 	return SAVED_CHANNEL;
	// }
	
	//Used when user connect, join the user 
	async joinAllRoom(client: Socket) {
		//Search for all rooms the user is in and join all
	}

	//Used when user leave a group chat
	leaveRoom(channelId: string, client: Socket) {
		//Remove roomID from user
		client.leave(channelId);
	}

	//Used when user disconnect or is playing game. Make sure incoming message not disturb the user
	leaveAllRoom(client: Socket){
		//Search for all rooms the user is in and leave all
	}

	checkRoomExist(channelId: string): any {
		// const TARGET_ROOM = this.chatRooms.find(room => room.channelId === channelId);
		// return TARGET_ROOM ? true : false;
	}

	findAllMessages(channelId: string): any {
		// const TARGET_ROOM = this.chatRooms.find(room => room.channelId === channelId);
		// if (!TARGET_ROOM){
			// return [];
		// }
		// return TARGET_ROOM.messages;
	}

	// addMessage(channelId: string, message: string) {
		// const TARGET_ROOM = this.chatRooms.find(room => room.channelId === channelId);
		// TARGET_ROOM.messages.push(message);
	// }

	// async getAllChatByID(id: string): Promise<string[]>{
	// 	//return all user chat
	// }

	// async newChat(userId: number, visibility: string, password: string, members: number[]): Promise<string>{
	// 	//Create a new chat room with given information
	// }

	// async updateChatSetting(userId: number, chatId: string, visibility: string, password: string): Promise<string>{
	// 	//check if user is owner, if yes, update chat setting
	// }

	// async updateChatMember(userId: number, chatId: string, memberId: number, action: string): Promise<string>{
	// 	//check if user is admin, if yes, update chat member
	// }
}