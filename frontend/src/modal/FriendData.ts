export interface FriendData {
  senderName: string;
  receiverName: string;
  receiverIntraName: string;
  eloScore: number;
  status: string;
  avatar: string;
}

export const FriendTags = {
  friend: "friend",
  muted: "muted",
  blocked: "blocked",
  pending: "pending"
}
