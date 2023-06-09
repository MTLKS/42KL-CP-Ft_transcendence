import React, { useContext, useEffect } from 'react'
import ChatButton from './ChatButton'
import { FaArrowLeft } from 'react-icons/fa'
import { NewChannelContext } from '../../../contexts/ChatContext';

interface ChatNavbarProps {
  backAction?: () => void;
  title?: string;
  nextComponent?: React.ReactNode;
  children?: React.ReactNode;
  nextAction?: () => void;
}

function ChatNavbar(props: ChatNavbarProps) {

  const { backAction, title, nextComponent, children, nextAction } = props;

  return (
    <div className='relative flex flex-row items-center justify-center w-full p-5 h-fit'>
      {
        children !== undefined && title === undefined
          ? children
          : <p className='w-full text-2xl font-extrabold text-center uppercase text-highlight'>{title}</p>
      }
      <div className='absolute flex flex-row justify-between w-[95%]'>
        <ChatButton icon={<FaArrowLeft />} onClick={backAction} />
        {nextComponent !== undefined && nextComponent}
      </div>
    </div>
  )
}

export default ChatNavbar