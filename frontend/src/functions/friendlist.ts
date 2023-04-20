import api from "../api/api";

export type status = "pending" | "accepted" | "rejected" | "blocked" | "muted";

export function friendList() {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<FriendData[]>("friendship");
}

export function friendListOf(name: string) {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<FriendData[]>("friendship/" + name);
}

export function friendStatusUpdate(friendId: string, status: status) {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  const data: FriendData = {
    receiverId: parseInt(friendId),
    status: status,
  };
  return api.post<FriendData>("friendship", data);
}
