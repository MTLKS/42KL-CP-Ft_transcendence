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
    <div className='w-full h-fit flex flex-row relative p-5 items-center justify-center'>
      {
        children !== undefined && title === undefined
          ? children
          : <p className='text-2xl font-extrabold text-center text-highlight w-full uppercase'>{title}</p>
      }
      <div className='absolute flex flex-row justify-between w-[95%]'>
        <ChatButton icon={<FaArrowLeft />} onClick={backAction} />
        {nextComponent !== undefined && nextComponent}
      </div>
    </div>
  )
}

export default ChatNavbar