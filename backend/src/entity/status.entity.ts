import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'status' } )
export class User {
  @PrimaryColumn()
  messageId: number;

  @Column()
  userId: number;

  @Column()
	read: boolean;
}
