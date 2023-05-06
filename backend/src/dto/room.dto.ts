import { ChatDTO } from './chat.dto';

export class RoomDTO {
	constructor(id : string) {
		this.channelId = id;
		this.messages = [];
	}
	channelId: string;
	messages : ChatDTO[];
}