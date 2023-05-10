import { createContext } from "react";
import SocketApi from "../api/socketApi";

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

interface ChatroomsContextType {
  chatrooms: TemporaryChatRoomData[],
}

export const ChatroomsContext = createContext<ChatroomsContextType>({
  chatrooms: [],
});

interface ChatroomContentContextType {
  chatroomContent: TemporaryChatRoomData,
}

export const ChatroomContentContext = createContext<ChatroomContentContextType>({
  chatroomContent: {
    intraName: "",
    type: "dm",
    createdAt: new Date().toISOString(),
  },
});