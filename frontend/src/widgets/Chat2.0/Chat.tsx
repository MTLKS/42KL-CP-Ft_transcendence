import React, { ReactNode, useEffect, useRef, useState } from 'react'
import ChatToggle from './ChatToggle'
import ChatEmptyState from './ChatEmptyState';
import ChannelList from './ChatroomBody/Channel/ChannelList';
import ChatNavbar from './ChatNavbar';
import ChatTableTitle from './ChatTableTitle';
import NewChat from './ChatroomBody/NewChat';
import ChatroomHeader from './ChatroomBody/Chatroom/ChatroomHeader';
import Chatroom from './ChatroomBody/Chatroom/Chatroom';
import ChatroomList from './ChatroomBody/Chatroom/ChatroomList';
import ChatroomContent from './ChatroomBody/Chatroom/ChatroomContent';

function Chat() {

  const [expanded, setExpanded] = useState(false);
  const [chatroomBody, setChatroomBody] = useState(<ChatroomContent/>);

  return (
    <div className={`flex flex-col select-none transition-all duration-300 overflow-hidden ${expanded ? 'h-full' : 'h-[60px]'}`}>
      <ChatToggle toggleChat={handleToggleChat} expanded={expanded}/>
      <div className='h-full'>
        {chatroomBody}
      </div>
    </div>
  )

  function handleToggleChat() {
    setExpanded(!expanded);
  }
}

export default Chat