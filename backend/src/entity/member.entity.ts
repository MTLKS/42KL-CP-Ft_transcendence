import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';

@Entity( { name: 'member' } )
export class Member {
	constructor(user: User, channelId: number, isAdmin: boolean, isBanned: boolean, isMuted: boolean, lastRead: string) {
		this.user = user;
		this.channelId = channelId;
		this.isAdmin = isAdmin;
		this.isBanned = isBanned;
		this.isMuted = isMuted;
		this.lastRead = lastRead;
	}
	
	@PrimaryGeneratedColumn()
	memberId: number;
	
	@ManyToOne(() => User, user => user)
	user: User;

	// Change this to a ManyToOne channel relationship
	@Column()
	channelId: number;

	@Column()
	isAdmin: boolean;

	@Column()
	isBanned: boolean;

	@Column()
	isMuted: boolean;

	@Column()
	lastRead: string;
}