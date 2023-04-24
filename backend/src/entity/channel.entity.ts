import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity( { name: 'channel' } )
export class Channel {
	constructor(channelName: string, ownerIntraName: string, isPrivate: boolean, password: string, isRoom: boolean, roommateIntraName: string) {
		this.channelName = channelName;
		this.ownerIntraName = ownerIntraName;
		this.private = isPrivate;
		this.password = password;
		this.isRoom = isRoom;
		this.roommateIntraName = roommateIntraName;
	}

	@PrimaryGeneratedColumn()
	channelId: number;
	
	@Column({ nullable: true })
	channelName: string;

	@Column({ nullable: true })
	ownerIntraName: string;
	
	@Column()
	private: boolean;
	
	@Column({ nullable: true })
	password: string;

	@Column()
	isRoom: boolean;

	@Column({ nullable: true })
	roommateIntraName: string;
}