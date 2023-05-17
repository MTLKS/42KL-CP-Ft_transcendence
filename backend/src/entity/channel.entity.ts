import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';

@Entity( { name: 'channel' } )
export class Channel {
	constructor(owner: User, channelName: string, isPrivate: boolean, password: string, isRoom: boolean, lastActivity: string) {
		this.owner = owner;
		this.channelName = channelName;
		this.isPrivate = isPrivate;
		this.password = password;
		this.isRoom = isRoom;
		this.lastActivity = lastActivity;
	}

	@PrimaryGeneratedColumn()
	channelId: number;
	
	@ManyToOne(() => User, user => user)
	owner: User;

	@Column()
	channelName: string;
	
	@Column()
	isPrivate: boolean;
	
	@Column({ nullable: true })
	password: string;

	@Column()
	isRoom: boolean;

	@Column()
	lastActivity: string;
}