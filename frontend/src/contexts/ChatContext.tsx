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
