import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'friendship' } )
export class Friendship {
	@PrimaryColumn()
	senderId: number;
	
	@Column()
	receiverId: number;

	@Column()
	status: string;
}