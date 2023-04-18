import api from "../api/api";
import { UserData } from "../modal/UserData";

export function getMyProfile() {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<UserData>("/user");
}

export function getProfileOfUser(id: string) {
  api.updateToken(
    "Authorization",
    document.cookie
      .split(";")
      .find((cookie) => cookie.includes("Authorization"))
      ?.split("=")[1] ?? ""
  );
  return api.get<UserData>(`/user/${id}`);
}
