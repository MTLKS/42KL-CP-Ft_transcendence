import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'status' } )
export class Status {
  constructor(clientId: string, userId: number, status: string) {
    this.clientId = clientId;
    this.userId = userId;
    this.status = status;
  }

  @PrimaryColumn()
  clientId: string;

  @Column()
  userId: number;

  @Column()
	status: string;
}
