import { Socket } from 'socket.io';

export class Player {
	public intraName: string;
	public socket: Socket;

	constructor(intraName: string, socket: Socket) {
		this.intraName = intraName;
		this.socket = socket;
	}
}