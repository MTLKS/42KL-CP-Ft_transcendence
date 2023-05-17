export interface ChatRoomData {
  id: string;
  name: string;
  ownerId: string;
  private: boolean;
  password: string | null;
}

export interface ChatRoomMemberData {
  channelId: string;
  userId: string;
  admin: boolean;
  banned: boolean;
  muted: boolean;
  lastRead: Date;
}

Date.prototype.toJSON = function () {
  return this.getTime().toString();
};

export interface ChatRoomMessageData {
  messageId: string;
  senderId: string;
  recieverId: string;
  channel: boolean;
  message: string;
  timestamp: Date;
}
