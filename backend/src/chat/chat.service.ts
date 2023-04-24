import { Injectable } from "@nestjs/common";
import { ChatDTO } from "src/dto/chat.dto";
import { RoomDTO } from "src/dto/room.dto";
import { Socket } from "socket.io";

@Injectable()
export class ChatService{
	private chatRooms: RoomDTO[] = [];

	//Used when a user start a new chat or join a new group
	async joinRoom(roomId: string, client: Socket): Promise<string>{
		if (!this.checkRoomExist(roomId)){
			this.createRoom(roomId);
		}
		//Store roomID in user
		await client.join(roomId);
		return (roomId);
	}
	
	//Used when user connect, join the user 
	async joinAllRoom(client: Socket){
		//Search for all rooms the user is in and join all
	}

	//Used when user leave a group chat
	leaveRoom(roomId: string, client: Socket){
		//Remove roomID from user
		client.leave(roomId);
	}

	//Used when user disconnect or is playing game. Make sure incoming message not disturb the user
	leaveAllRoom(client: Socket){
		//Search for all rooms the user is in and leave all
	}

	checkRoomExist(roomId: string): boolean{
		const TARGET_ROOM = this.chatRooms.find(room => room.roomId === roomId);
		return TARGET_ROOM ? true : false;
	}

	createRoom(roomId: string){
		const NEW_ROOM = new RoomDTO(roomId);
		this.chatRooms.push(NEW_ROOM);
	}

	findAllMessages(roomId: string): ChatDTO[]{
		const TARGET_ROOM = this.chatRooms.find(room => room.roomId === roomId);
		if (!TARGET_ROOM){
			return [];
		}
		return TARGET_ROOM.messages;
	}

	addMessage(roomId: string, message: ChatDTO){
		const TARGET_ROOM = this.chatRooms.find(room => room.roomId === roomId);
		TARGET_ROOM.messages.push(message);
	}

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