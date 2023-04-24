import { ChatDTO } from './chat.dto';

export class RoomDTO {
	constructor(id : string) {
		this.roomId = id;
		this.messages = [];
	}
	roomId: string;
	messages : ChatDTO[];
}