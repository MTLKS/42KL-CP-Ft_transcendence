import React from 'react'
import { BsFillChatLeftFill } from 'react-icons/bs'

interface ChatToggleProps {
  onClick: () => void;
}

/**
 * The last component inside chatToggle is the indicator for new message
 * By default, it's set to hidden, later when we are able to know there's new message,
 * set the element as block
 */
function ChatToggle(props: ChatToggleProps) {

  const { onClick } = props;

  return (
    <div className='flex flex-row w-full h-fit p-6 uppercase text-dimshadow bg-highlight justify-between items-center cursor-pointer' onClick={onClick}>
      <div className='flex flex-row text-2xl items-center'>
        <p className='font-extrabold'>chat</p>
        <BsFillChatLeftFill className='ml-3' />
      </div>
      <div className='rounded-full h-6 w-6 animate-ping bg-accRed hidden'></div>
    </div>
  )
}

export default ChatToggle