import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'member' } )
export class Friendship {
	@PrimaryColumn()
	channelId: number;
	
	@Column()
	userId: number;

	@Column()
	admin: boolean;

	@Column()
	banned: boolean;

	@Column()
	muted: boolean;
}