import React from 'react'
import { BsFillChatLeftFill } from 'react-icons/bs';
import ChatSearchBar from './ChatSearchBar';
import ChatMsgIndicator from './ChatMsgIndicator';
import ChatButton from './ChatButton';
import { FaArrowLeft, FaPlusSquare } from 'react-icons/fa';

interface ChatToggleProps {
  toggleChat: () => void;
  expanded: boolean;
}

function ChatToggle(props: ChatToggleProps) {

  const { toggleChat, expanded } = props;

  return (
    <div className='flex flex-row w-full h-fit p-4 uppercase text-dimshadow bg-highlight justify-between items-center cursor-pointer' onClick={toggleChat}>
      <div className='flex flex-row text-xl items-center'>
        <p className='font-extrabold'>chat</p>
        <BsFillChatLeftFill className='ml-3' />
      </div>
      {expanded
        ? <ChatSearchBar />
        : <ChatMsgIndicator total={0} />
      }
    </div>
  )
}

export default ChatToggle