import api from "../api/api";

interface Relationship {
  senderId?: number;
  receiverId: number;
  status: string;
}

export type status = "pending" | "accepted" | "rejected" | "blocked" | "muted";

export function friendList() {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<Relationship[]>("friendlist");
}

export function friendListOf(name: string) {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<Relationship[]>("friendlist/" + name);
}

export function friendStatusUpdate(friendId: string, status: status) {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  const data: Relationship = {
    receiverId: parseInt(friendId),
    status: status,
  };
  return api.post<Relationship>("friendlist", data);
}
