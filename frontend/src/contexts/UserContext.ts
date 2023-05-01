import { createContext } from "react";
import { UserData } from "../modal/UserData";

export const UserContext = createContext<UserData>({
  intraId: 130305,
  userName: "JOHNDOE",
  intraName: "johndoe",
  elo: 400,
  accessToken: "null",
  avatar: "",
  tfaSecret: null,
})