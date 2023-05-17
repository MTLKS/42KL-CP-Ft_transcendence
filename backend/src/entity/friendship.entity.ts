import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'friendship' } )
export class Friendship {
	constructor(senderIntraName: string, receiverIntraName: string, status: string) {
		this.senderIntraName = senderIntraName;
		this.receiverIntraName = receiverIntraName;
		this.status = status;
	}

	@PrimaryGeneratedColumn()
	id: number;

	// Change this to a ManyToOne user relationship
	@Column()
	senderIntraName: string;
	
	// Change this to a ManyToOne user relationship
	@Column()
	receiverIntraName: string;

	@Column()
	status: string;
}