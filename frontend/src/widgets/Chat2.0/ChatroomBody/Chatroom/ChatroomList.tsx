import React from 'react'
import Chatroom from './Chatroom'
import ChatButton from '../../ChatButton'
import { HiServer } from 'react-icons/hi';
import { FaPlusSquare } from 'react-icons/fa'

function ChatroomList() {
  return (
    <div className='relative flex flex-col overflow-y-scroll scrollbar-hide border-box h-full'>
      <Chatroom />
      <div className='absolute bottom-0 right-0 flex flex-row gap-x-3.5 mb-5 mr-5'>
        <ChatButton icon={<HiServer className='text-dimshadow text-lg' />} title="join channel" />
        <ChatButton icon={<FaPlusSquare className='text-dimshadow text-lg' />} title="new chat" />
      </div>
    </div>
  )
}

export default ChatroomList