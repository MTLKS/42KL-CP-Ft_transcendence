import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'channel' } )
export class Friendship {
	@PrimaryGeneratedColumn()
	channelId: number;
	
	@Column()
	channelName: string;

	@Column()
	ownerId: number;
	
	@Column()
	private: boolean;
	
	@Column( { nullable: true } )
	password: string;
}