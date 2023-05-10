import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'friendship' } )
export class Friendship {
	constructor(senderIntraName: string, receiverIntraName: string, status: string, chatted: boolean = false) {
		this.senderIntraName = senderIntraName;
		this.receiverIntraName = receiverIntraName;
		this.status = status;
		this.chatted = chatted;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	senderIntraName: string;
	
	@Column()
	receiverIntraName: string;

	@Column()
	status: string;

	@Column()
	chatted: boolean;
}