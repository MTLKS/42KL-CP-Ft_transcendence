import React from 'react'
import { FaUser } from 'react-icons/fa'
import ChatMsgIndicator from '../../ChatMsgIndicator'
import ChatButton from '../../ChatButton';

interface ChatroomProps {
  openChatroom?: () => void;
}

function Chatroom(props: ChatroomProps) {

  const { openChatroom } = props;

  return (
    <div
      className='h-16 w-full flex flex-row cursor-pointer group'
      onClick={openChatroom}
    >
      <div className='p-4 bg-highlight aspect-square h-full'>
        {/** TODO: Change icon based on the chatroom type "isRoom" */}
        <FaUser className='w-full h-full text-dimshadow'/>
      </div>
      <div className='border-box flex flex-row justify-between w-full items-center p-5 border-b-2 border-highlight/50'>
        <p className='text-highlight font-extrabold text-lg w-[20ch] truncate group-hover:underline'>JOHNDOE</p>
        <ChatMsgIndicator total={1}/>
      </div>
    </div>
  )
}

export default Chatroom