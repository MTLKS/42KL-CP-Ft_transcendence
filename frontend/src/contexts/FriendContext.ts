import { createContext } from "react";
import { FriendData } from "../modal/FriendData";

interface FriendsContextType {
  friends: FriendData[],
  setFriends: (updatedFriends: FriendData[]) => void;
}

export const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  setFriends: () => {},
});