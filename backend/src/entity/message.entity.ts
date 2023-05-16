import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';

@Entity( { name: 'message' } )
export class Message {
	constructor(user: User, channelId: number, isRoom: boolean, message: string, timeStamp: string) {
		this.user = user;
		this.channelId = channelId;
		this.isRoom = isRoom;
		this.message = message;
		this.timeStamp = timeStamp;
	}

	@PrimaryGeneratedColumn()
	messageId: number;

	@ManyToOne(() => User, user => user)
	user: User;

	// Change this to a ManyToOne channel relationship
	@Column()
	channelId: number;

	@Column()
	isRoom: boolean;

	@Column()
	message: string;

	@Column()
	timeStamp: string;
}