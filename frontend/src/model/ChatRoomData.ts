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

export interface ChannelData {
  owner: UserData,
  channelName: string,
  isPrivate: boolean,
	password: null | string,
	isRoom: boolean,
	channelId: number
}

export interface ChatroomMessageData {
  senderChannel: ChannelData;
  receiverChannel: ChannelData;
  isRoom: boolean;
  message: string;
  messageId: number;
  timeStamp: string;
}

export interface NewMessageData {
  messageId: number;
  intraName: string;
  message: string;
}

export interface MemberData {
  user: UserData,
  channel: ChannelData,
  isAdmin: boolean,
  isBanned: boolean,
  isMuted: boolean,
  lastRead: string,
  memberId: number
}
