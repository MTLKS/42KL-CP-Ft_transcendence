import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'users' } )
export class User {

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
