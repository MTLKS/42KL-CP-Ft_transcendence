import React, { useContext, useEffect, useMemo, useState } from 'react'
import ChatToggle from './ChatWidgets/ChatToggle'
import ChatroomList from './ChatroomBody/Chatroom/ChatroomList';
import { ChatContext, UnreadChatroomsContext } from '../../contexts/ChatContext';
import SocketApi from '../../api/socketApi';

const CHAT_SOCKET_NAMESPACE = "chat";

function Chat() {

  const [unreadChatrooms, setUnreadChatrooms] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [chatroomBody, setChatroomBody] = useState(<ChatroomList />);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatSocket = useMemo(() => new SocketApi(CHAT_SOCKET_NAMESPACE), []);

  useEffect(() => {
    // for receive new message
    chatSocket.connect();
    chatSocket.listen("message", (data: any) => {
      if (unreadChatrooms.includes(data.channelId)) return;
      unreadChatrooms.push(data.channelId);
      setHasNewMessage(true);
    });
  }, []);

  useEffect(() => {
    console.log(unreadChatrooms);
  }, [unreadChatrooms]);

  // toggle chat
  const handleToggleChat = () => {
    setExpanded(!expanded);
  }

  return (
    <UnreadChatroomsContext.Provider value={{ unreadChatrooms: unreadChatrooms, setUnreadChatrooms: setUnreadChatrooms }}>
      <ChatContext.Provider value={{ chatSocket: chatSocket, chatBody: chatroomBody, setChatBody: setChatroomBody}}>
        <div className={`flex flex-col select-none transition-all duration-300 overflow-hidden ${expanded ? 'h-full' : 'h-[60px]'} box-border`}>
          <ChatToggle toggleChat={handleToggleChat} expanded={expanded} hasNewMessage={unreadChatrooms.length > 0} />
          {expanded && chatroomBody}
        </div>
      </ChatContext.Provider>
    </UnreadChatroomsContext.Provider>
  )
}

export default Chat