import React from 'react'
import { BsFillChatLeftFill } from 'react-icons/bs'

interface ChatToggleProps {
  onClick: () => void;
  onFilterUpdate?: (filter: string) => void;
  expanded: boolean;
}

/**
 * The last component inside chatToggle is the indicator for new message
 * By default, it's set to hidden, later when we are able to know there's new message,
 * set the element as block
 */
function ChatToggle(props: ChatToggleProps) {

  const { onClick, onFilterUpdate, expanded } = props;

  return (
    <div className='flex flex-row w-full h-fit p-4 uppercase text-dimshadow bg-highlight justify-between items-center cursor-pointer' onClick={onClick}>
      <div className='flex flex-row text-xl items-center'>
        <p className='font-extrabold'>chat</p>
        <BsFillChatLeftFill className='ml-3' />
      </div>
      <div>
        <div className='rounded-full h-6 w-6 animate-ping bg-accRed hidden'></div>
        <input
          className={`bg-dimshadow p-[2px] text-highlight rounded-md font-semibold text-xs sm:text-sm md:text-lg lg:text-xl  w-full focus:[outline:none] focus:animate-pulse-short`}
          type="text"
          name="name"
          autoComplete="off"
          onChange={(e) => onFilterUpdate!(e.currentTarget.value)}
        />
      </div>
    </div>
  )
}

export default ChatToggle