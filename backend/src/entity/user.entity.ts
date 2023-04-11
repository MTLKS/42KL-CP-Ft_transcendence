import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'users' } )
export class User {

  @PrimaryColumn( { nullable: false } )
  intraId: number;

  @Column( { nullable: false } )
	accessToken: string;

  @Column( { nullable: true } )
  tfaSecret: string;
}
