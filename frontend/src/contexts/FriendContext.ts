import { createContext } from "react";
import { FriendData } from "../modal/FriendData";
import { AxiosResponse } from "axios";

interface FriendsContextType {
  friends: FriendData[],
  setFriends: (updatedFriends: FriendData[]) => void;
}

export const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  setFriends: () => {},
});

export const FriendActionContext = createContext<string>("");