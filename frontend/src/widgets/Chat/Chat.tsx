import React, { useContext, useEffect, useMemo, useState } from 'react'
import ChatToggle from './ChatWidgets/ChatToggle'
import ChatroomList from './ChatroomBody/Chatroom/ChatroomList';
import { ChatContext, ChatroomsContext } from '../../contexts/ChatContext';
import SocketApi from '../../api/socketApi';
import { FriendsContext } from '../../contexts/FriendContext';
import { ChatroomData } from '../../model/ChatRoomData';
import { getChatroomList } from '../../functions/chatAPIs';

const CHAT_SOCKET_NAMESPACE = "chat";

function Chat() {

  const { friends } = useContext(FriendsContext);
  const [unreadChatrooms, setUnreadChatrooms] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false); // for chat toggle button
  const [chatroomBody, setChatroomBody] = useState(<ChatroomList />);
  const [chatrooms, setChatrooms] = useState<ChatroomData[]>([]);
  const chatSocket = useMemo(() => new SocketApi(CHAT_SOCKET_NAMESPACE), []);

  useEffect(() => {
    // for receive new message
    const newUnreadChatrooms: number[] = [];
    chatSocket.connect();
    chatSocket.listen("message", (data: any) => {
      if (unreadChatrooms.includes(data.channelId)) return;
      newUnreadChatrooms.push(data.channelId);
      setUnreadChatrooms(newUnreadChatrooms);
      setHasNewMessage(true);
    });
    return () => chatSocket.removeListener("message"); // don't remove this
  }, []);

  useEffect(() => {
    getAllChatrooms();
  }, [friends]);

  useEffect(() => {
    console.log(chatrooms);
  }, [chatrooms]);

  // toggle chat
  const handleToggleChat = () => {
    setExpanded(!expanded);
  }

  const getAllChatrooms = async() => {

    const chatrooms: ChatroomData[] = [];

    const chatroomsFromDb = await getChatroomList();
    if (chatroomsFromDb.data.length > 0) {
      chatrooms.push(...chatroomsFromDb.data);
    }
    setChatrooms(chatrooms);
  }

  useEffect(() => {
    if (unreadChatrooms.length > 0) setHasNewMessage(true);
    else setHasNewMessage(false);
  }, [unreadChatrooms]);

  return (
    <ChatroomsContext.Provider value={{ chatrooms: chatrooms, unreadChatrooms: unreadChatrooms, setUnreadChatrooms: setUnreadChatrooms }}>
      <ChatContext.Provider value={{ chatSocket: chatSocket, chatBody: chatroomBody, setChatBody: setChatroomBody}}>
        <div className={`flex flex-col select-none transition-all duration-300 overflow-hidden ${expanded ? 'h-full' : 'h-[60px]'} box-border`}>
          <ChatToggle toggleChat={handleToggleChat} expanded={expanded} hasNewMessage={hasNewMessage} />
          {expanded && chatroomBody}
        </div>
      </ChatContext.Provider>
    </ChatroomsContext.Provider>
  )
}

export default Chat