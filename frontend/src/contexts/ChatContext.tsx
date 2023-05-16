import { createContext } from "react";
import SocketApi from "../api/socketApi";
import { ChatroomData, ChatroomMessageData, MemberData } from "../model/ChatRoomData";

interface ChatContextType {
  chatSocket: SocketApi,
  chatBody: JSX.Element,
  setChatBody: (newChatBody: JSX.Element) => void,
}

export const ChatContext = createContext<ChatContextType>({
  chatSocket: new SocketApi("/chat"),
  chatBody: <></>,
  setChatBody: (newChatBody: JSX.Element) => {},
});

interface NewChatContextType {
  members: string[],
}

export const NewChatContext = createContext<NewChatContextType>({
  members: [],
});

interface ChatroomContentContextType {
  chatroomContent: ChatroomData,
}

export const ChatroomContentContext = createContext<ChatroomContentContextType>({
  chatroomContent: {
    channelId: 0,
    channelName: "",
    isPrivate: false,
    isRoom: false,
    password: null,
    owner: null,
    newMessage: false,
  },
});

interface ChatroomMessagesContextType {
  messages: ChatroomMessageData[],
  setMessages: (newMessages: ChatroomMessageData[]) => void,
}

export const ChatroomMessagesContext = createContext<ChatroomMessagesContextType>({
  messages: [],
  setMessages: (newMessages: ChatroomMessageData[]) => {},
})

interface ChatMemberContextType {
  member: MemberData | null;
}

export const ChatMemberContext = createContext<ChatMemberContextType>({
  member: null,
});

interface ChatroomsContextType {
  chatrooms: ChatroomData[],
  unreadChatrooms: number[];
  setUnreadChatrooms: (newUnreadChatrooms: number[]) => void;
}

export const ChatroomsContext = createContext<ChatroomsContextType>({
  chatrooms: [],
  unreadChatrooms: [],
  setUnreadChatrooms: (newUnreadChatrooms: number[]) => {},
});
