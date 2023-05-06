import api from "../api/api";
import { UserData } from "../modal/UserData";

export function getMyProfile() {
  return api.get<UserData | ErrorData>("/user");
}

export function getProfileOfUser(id: string) {
  return api.get<UserData | ErrorData>(`/user/${id}`);
}
