import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'users' } )
export class User {
  constructor(intraId: number, userName: string, intraName: string, elo: number, accessToken: string, avatar: string, tfaSecret: string) {
    this.intraId = intraId;
    this.userName = userName;
    this.intraName = intraName;
    this.elo = elo;
    this.accessToken = accessToken;
    this.avatar = avatar;
    this.tfaSecret = tfaSecret;
  }

  @PrimaryColumn()
  intraId: number;

  @Column()
  userName: string;

  @Column()
  intraName: string;

  @Column()
  elo: number;

  @Column()
	accessToken: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  tfaSecret: string;

  @Column({ default: true })
  winning: boolean;
}
