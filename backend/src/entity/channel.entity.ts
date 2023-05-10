import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'channel' } )
export class Channel {
	constructor(channelName: string, ownerIntraName: string, ownerUserName: string, isPrivate: boolean, password: string, isRoom: boolean) {
		this.channelName = channelName;
		this.ownerIntraName = ownerIntraName;
		this.ownerUserName = ownerUserName;
		this.isPrivate = isPrivate;
		this.password = password;
		this.isRoom = isRoom;
	}

	@PrimaryGeneratedColumn()
	channelId: number;
	
	@Column()
	channelName: string;

	@Column()
	ownerIntraName: string;

	@Column()
	ownerUserName: string;
	
	@Column()
	isPrivate: boolean;
	
	@Column({ nullable: true })
	password: string;

	@Column()
	isRoom: boolean;
}