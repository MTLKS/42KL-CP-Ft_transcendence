import { Channel } from "src/entity/channel.entity";
import { Message } from "src/entity/message.entity";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "src/entity/member.entity";
import { Injectable } from "@nestjs/common";
import { ChatDTO } from "src/dto/chat.dto";
import { RoomDTO } from "src/dto/room.dto";
import { Repository } from "typeorm";
import { Socket } from "socket.io";

@Injectable()
export class ChatService {
	constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, @InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Message) private messageRepository: Repository<Message>, private userService: UserService) {}

	private chatRooms: RoomDTO[] = [];
	
	async createNewDM(accessToken: string, receiverIntraName: string): Promise<any> {
		const SENDER = await this.userService.getMyUserData(accessToken);
		if (receiverIntraName === undefined)
			return {"error": "Invalid receiverIntraName - receiverIntraName(string) is undefined"};
		if (receiverIntraName === SENDER.intraName)
			return {"error": "Invalid receiverIntraName - no friends so you DM yourself?"};
		const RECEIVER = await this.userService.getUserDataByIntraName(receiverIntraName);
		if (RECEIVER === undefined)
			return {"error": "Invalid receiverIntraName - receiverIntraName is not found"};
		if ([...await this.channelRepository.find({ where: {roommateIntraName: SENDER.intraName} }), ...await this.channelRepository.find({ where: {roommateIntraName: RECEIVER.intraName} })].length !== 0)
			return {"error": "DM already exist"}

		const SAVED_CHANNEL = await this.channelRepository.save(new Channel(null, null, true, null, false, RECEIVER.intraName));
		await this.memberRepository.save(new Member(SAVED_CHANNEL.channelId, SENDER.userName, true, false, false, new Date().toISOString()));
		await this.memberRepository.save(new Member(SAVED_CHANNEL.channelId, RECEIVER.userName, true, false, false, new Date().toISOString()));
		return SAVED_CHANNEL;
	}

	async createNewRoom(accessToken: string, roomName: string, isPrivate: boolean, password: string): Promise<any> {
		const SENDER = await this.userService.getMyUserData(accessToken);
		for (var value of [roomName, isPrivate, password]) {
			if (value === undefined)
				return {"error": "Invalid body - body must include roomName(string), isPrivate(boolean), and password(nullable string)"};
		}
		if (roomName.length > 16 || roomName.length < 1)
			return {"error": "Invalid roomName - roomName is must be 1-16 characters only"};
		
		const SAVED_CHANNEL = await this.channelRepository.save(new Channel(roomName, SENDER.intraName, isPrivate, password, true, null));
		await this.memberRepository.save(new Member(SAVED_CHANNEL.channelId, SENDER.userName, true, false, false, new Date().toISOString()));
		return SAVED_CHANNEL;
	}

	//Used when a user start a new chat or join a new group
	async joinRoom(server: any, client: Socket, channelId: string, message: string): Promise<any> {
		// const ROOM = await this.channelRepository.find({ where: {channelId} });
		// if (ROOM.length === 0)
		// return server.emit("msgToServer", "Channel not found")
		// const USER = await this.userService.getMyUserData(client.handshake.headers.authorization);
		// await client.join(channelId);
		// const NEW_MESSAGE = new Message(USER.intraName, ROOM[0].channelId, );
		return channelId;
	}
	
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
		const TARGET_ROOM = this.chatRooms.find(room => room.channelId === channelId);
		return TARGET_ROOM ? true : false;
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