import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'friendship' } )
export class Friendship {
	constructor(senderId: number, receiverId: number, status: string) {
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.status = status;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	senderId: number;
	
	@Column()
	receiverId: number;

	@Column()
	status: string;
}