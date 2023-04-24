import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message' })
export class Message {
  constructor(
    senderId: string,
    receiverChannelId: string,
    channel: boolean,
    message: string,
    timeStamp: string,
  ) {
    this.senderIntraName = senderId;
    this.receiverChannelId = receiverChannelId;
    this.channel = channel;
    this.message = message;
    this.timeStamp = timeStamp;
  }

  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  senderIntraName: string;

  @Column()
  receiverChannelId: string;

  @Column()
  channel: boolean;

  @Column()
  message: string;

  @Column()
  timeStamp: string;
}
