import api from "../api/api";
import { FriendData } from "../modal/FriendData";

const NAMESPACE = "/friendship";
export type status = "pending" | "accepted" | "rejected" | "blocked" | "muted";

export function getFriendList() {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<FriendData[]>(NAMESPACE);
}

export function friendListOf(name: string) {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<FriendData[]>(`${NAMESPACE}/` + name);
}

export function friendStatusUpdate(friend: FriendData, status: status) {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  const data: FriendData = {
    ...friend,
    status: status,
  };
  return api.post<FriendData>(NAMESPACE, data);
}
