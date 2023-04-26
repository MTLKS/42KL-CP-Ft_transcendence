export interface FriendData {
  id: number;
  senderIntraName: string;
  receiverIntraName: string;
  elo: number;
  status: string;
  userName: string
  avatar: string;
}

export interface FriendRequestType {
  id: number;
  receiverIntraName: string;
  senderIntraName: string;
  status: string;
}

export const FriendTags = {
  accepted: "accepted",
  muted: "muted",
  blocked: "blocked",
  pending: "pending"
}
