import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'member' })
export class Member {
  constructor(
    channelId: number,
    userName: string,
    admin: boolean,
    banned: boolean,
    muted: boolean,
    lastRead: string,
  ) {
    this.channelId = channelId;
    this.userName = userName;
    this.admin = admin;
    this.banned = banned;
    this.muted = muted;
    this.lastRead = lastRead;
  }

  @PrimaryGeneratedColumn()
  memberId: number;

  @Column()
  channelId: number;

  @Column()
  userName: string;

  @Column()
  admin: boolean;

  @Column()
  banned: boolean;

  @Column()
  muted: boolean;

  @Column()
  lastRead: string;
}
