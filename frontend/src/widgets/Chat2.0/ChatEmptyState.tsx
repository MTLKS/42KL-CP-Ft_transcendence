import React from 'react'
import { FaSadTear } from 'react-icons/fa'
import ChatButton from './ChatButton'
import { HiServer } from 'react-icons/hi'
import { FaPlusSquare } from 'react-icons/fa';

function ChatEmptyState() {
  return (
    <div className='w-[60%] flex flex-col gap-y-3.5 text-highlight items-center m-auto mt-52'>
      <FaSadTear className='text-accYellow text-7xl'/>
      <p className='text-xl font-extrabold'>No messages, yet.</p>
      <p className='text-center'>Ready to ball out? Chat with friends or join a channel to rally up.</p>
      <ChatButton icon={<HiServer className='text-dimshadow text-lg' />} title="join channel" />
      <ChatButton icon={<FaPlusSquare className='text-dimshadow text-lg' />} title="new chat" />
    </div>
  )
}

export default ChatEmptyState