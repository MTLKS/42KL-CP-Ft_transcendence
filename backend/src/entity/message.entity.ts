import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'message' } )
export class Message {
	constructor(intraName: string, channelId: number, channel: boolean, message: string, timeStamp: string) {
		this.intraName = intraName;
		this.channelId = channelId;
		this.channel = channel;
		this.message = message;
		this.timeStamp = timeStamp;
	}

	@PrimaryGeneratedColumn()
	messageId: number;

	@Column()
	intraName: string;

	@Column()
	channelId: number;

	@Column()
	channel: boolean;

	@Column()
	message: string;

	@Column()
	timeStamp: string;
}