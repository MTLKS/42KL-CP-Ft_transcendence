import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'message' } )
export class Friendship {
	@PrimaryGeneratedColumn()
	messageId: number;
	
	@Column()
	senderId: number;

	@Column()
	receiverId: number;

	@Column()
	channel: boolean;
	
	@Column()
	message: string;
	
	@Column()
	timeStamp: string;
}