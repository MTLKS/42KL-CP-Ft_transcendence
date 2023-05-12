import React, { useContext, useEffect, useMemo, useState } from 'react'
import ChatToggle from './ChatWidgets/ChatToggle'
import ChatroomList from './ChatroomBody/Chatroom/ChatroomList';
import { ChatContext, ChatMemberContext } from '../../contexts/ChatContext';
import SocketApi from '../../api/socketApi';
import { MemberData } from '../../model/ChatRoomData';
import { getMemberData } from '../../functions/chatAPIs';

const CHAT_SOCKET_NAMESPACE = "chat";

function Chat() {

  const [expanded, setExpanded] = useState(false);
  const [chatroomBody, setChatroomBody] = useState(<ChatroomList />);
  const chatSocket = useMemo(() => new SocketApi(CHAT_SOCKET_NAMESPACE), []);

  useEffect(() => {
    // for receive new message
    chatSocket.connect();
    chatSocket.listen("message", (data: any) => {
      console.log("received new message: ", data);
    });

    return () => {
      chatSocket.removeListener("message");
    }
  }, []);

  // toggle chat
  const handleToggleChat = () => setExpanded(!expanded);

  return (
    <ChatContext.Provider value={{ chatSocket: chatSocket, chatBody: chatroomBody, setChatBody: setChatroomBody}}>
      <div className={`flex flex-col select-none transition-all duration-300 overflow-hidden ${expanded ? 'h-full' : 'h-[60px]'} box-border`}>
        <ChatToggle toggleChat={handleToggleChat} expanded={expanded} />
        {expanded && chatroomBody}
      </div>
    </ChatContext.Provider>
  )
}

export default Chat