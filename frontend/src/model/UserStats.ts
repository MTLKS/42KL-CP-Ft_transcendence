import { UserData } from "./UserData";

export interface UserStats {
  win: number;
  lose: number;
  worst_nightmare: UserData;
  punching_bag: UserData;
}
