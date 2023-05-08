import React, { useContext } from 'react'
import { FaSadTear } from 'react-icons/fa'
import ChatButton from './ChatWidgets/ChatButton'
import { HiServer } from 'react-icons/hi'
import { FaPlusSquare } from 'react-icons/fa';
import { ChatContext } from '../../contexts/ChatContext';
import NewChat from './ChatroomBody/CreateChat/NewChat';
import ChannelList from './ChatroomBody/Channel/ChannelList';

function ChatEmptyState() {

  const { setChatBody } = useContext(ChatContext);

  return (
    <div className='w-[60%] flex flex-col gap-y-3.5 text-highlight items-center m-auto mt-52'>
      <FaSadTear className='text-accYellow text-7xl' />
      <p className='text-xl font-extrabold'>No messages, yet.</p>
      <p className='text-center'>Ready to ball out? Chat with friends or join a channel to rally up.</p>
      <ChatButton icon={<HiServer />} title="join channel" onClick={() => setChatBody(<ChannelList />)} />
      <ChatButton icon={<FaPlusSquare />} title="new chat/channel" onClick={() => setChatBody(<NewChat />)} />
    </div>
  )
}

export default ChatEmptyState