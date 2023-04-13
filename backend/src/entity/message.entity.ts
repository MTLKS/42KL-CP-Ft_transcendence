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
	message: string;
	
	@Column( { nullable: true } )
	timeStamp: string;
}