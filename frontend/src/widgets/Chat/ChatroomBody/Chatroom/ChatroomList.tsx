import React, { useContext } from 'react'
import Chatroom from './Chatroom'
import ChatButton from '../../ChatWidgets/ChatButton'
import { HiServer } from 'react-icons/hi';
import { FaPlusSquare } from 'react-icons/fa'
import ChatEmptyState from '../../ChatEmptyState';
import NewChat from '../CreateChat/NewChat';
import { ChatContext } from '../../../../contexts/ChatContext';

function ChatroomList() {

  const { setChatBody } = useContext(ChatContext);

  return (
    <div className='relative flex flex-col overflow-y-scroll scrollbar-hide border-box h-full'>
      { <ChatEmptyState /> ||
        <>
          <Chatroom />
          <div className='absolute bottom-0 right-0 flex flex-row gap-x-3.5 mb-5 mr-5'>
            <ChatButton icon={<HiServer />} title="join channel" />
            <ChatButton icon={<FaPlusSquare />} title="new chat/channel" onClick={() => setChatBody(<NewChat />)} />
          </div>
        </>
      }
    </div>
  )
}

export default ChatroomList