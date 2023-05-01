import { FriendData } from "../modal/FriendData";
import { UserData } from "../modal/UserData";
import api from "../api/api";

const NAMESPACE = "/friendship"

export function addFriend(newFriendIntraName: string) {
  return api.post(NAMESPACE, {
    receiverIntraName: newFriendIntraName,
    status: "PENDING",
  });
}

export function acceptFriend(incomingFriendIntraName: string) {
  return api.patch(NAMESPACE, {
    receiverIntraName: incomingFriendIntraName,
    status: "ACCEPTED",
  });
}

export function blockExistingFriend(toBeBlockedIntraName: string) {
  return api.patch(NAMESPACE, {
    receiverIntraName: toBeBlockedIntraName,
    status: "BLOCKED",
  })
}

export function blockStranger(toBeBlockedIntraName: string) {
  return api.post(NAMESPACE, {
    receiverIntraName: toBeBlockedIntraName,
    status: "BLOCKED",
  })
}

export function muteFriend(toBeMutedIntraName: string) {
  return api.patch(NAMESPACE, {
    receiverIntraName: toBeMutedIntraName,
    status: "MUTED",
  })
}

export function unfriendFriend(toBeUnfriendedIntraName: string) {
  return api.delete(NAMESPACE, {
    receiverIntraName: toBeUnfriendedIntraName,
    status: "DELETE" // ?
  })
}

// no need to have another function to unblock stranger
export function unblockFriend(toBeUnblockedIntraName: string) {
  return api.delete(NAMESPACE, {
    receiverIntraName: toBeUnblockedIntraName,
    status: "DELETE" // ?
  })
}

export function unmuteFriend(toBeUnmutedIntraName: string) {
  return api.patch(NAMESPACE, {
    receiverIntraName: toBeUnmutedIntraName,
    status: "ACCEPTED"
  })
}
