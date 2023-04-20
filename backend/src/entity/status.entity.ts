import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity( { name: 'status' } )
export class Status {
  constructor(clientId: string, intraName: string, status: string) {
    this.clientId = clientId;
    this.intraName = intraName;
    this.status = status;
  }

  @PrimaryColumn()
  clientId: string;

  @Column()
  intraName: string;

  @Column()
	status: string;
}
