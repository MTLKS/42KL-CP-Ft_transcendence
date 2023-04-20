import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'message' } )
export class Friendship {
	@PrimaryColumn()
	socketId: string;

	@Column()
	userId: number;

	@Column()
	status: string;
}