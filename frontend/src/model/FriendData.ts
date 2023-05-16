export interface FriendData {
  senderIntraName: string;
  receiverIntraName: string;
  status: string;
  id: number;
  chatted: boolean;
  userName: string
  elo: number;
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
