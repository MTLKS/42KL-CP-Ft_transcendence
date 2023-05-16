import { UserData } from "./UserData";

Date.prototype.toJSON = function () {
  return this.getTime().toString();
};

export interface ChatroomData {
  channelId: number;
  channelName: string;
  isPrivate: boolean;
  isRoom: boolean;
  owner: UserData | null;
  password: string | null;
  newMessage: boolean;
}

export interface ChatroomMessageData {
  channel: boolean;
  channelId: number;
  message: string;
  messageId: number;
  timeStamp: string;
  user: UserData;
}

export interface NewMessageData {
  messageId: number;
  intraName: string;
  message: string;
}

export interface MemberData {
  user: UserData,
  channelId: number,
  admin: boolean,
  banned: boolean,
  muted: boolean,
  lastRead: string,
  memberId: number
}
