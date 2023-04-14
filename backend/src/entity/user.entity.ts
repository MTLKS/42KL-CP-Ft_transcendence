import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'users' } )
export class User {
  constructor(intraId: number, elo: number, accessToken: string, avatar: string, tfaSecret: string) {
    this.intraId = intraId;
    this.elo = elo;
    this.accessToken = accessToken;
    this.avatar = avatar;
    this.tfaSecret = tfaSecret;
  }

  @PrimaryColumn()
  intraId: number;

  @Column()
  elo: number;

  @Column()
	accessToken: string;

  @Column()
  avatar: string;

  @Column( { nullable: true } )
  tfaSecret: string;
}
