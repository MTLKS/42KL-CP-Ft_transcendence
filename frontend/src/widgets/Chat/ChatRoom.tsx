import React, { Fragment } from 'react'
import { FaUserAlt, FaUserFriends } from 'react-icons/fa';

interface ChatRoomProps {
  roomData: ChatRoomData;
  newMessage?: boolean;
  onClick?: () => void;
}

function ChatRoom(props: ChatRoomProps) {

  const { roomData, newMessage, onClick } = props;

  return (
    <div className='flex flex-row cursor-pointer p-4 bg-dimshadow text-highlight font-extrabold text-m uppercase border-b-4 border-highlight items-center justify-between'
      onClick={onClick}
    >
      <div className='flex flex-row items-center'>
        <p>{roomData.name}</p>
        {
          roomData.private ?
            <FaUserAlt className='' />
            : <FaUserFriends className='text-2xl' />
        }
      </div>
      <div className='h-6 w-6 rounded-full bg-accRed animate-ping hidden'></div>
    </div>
  )
}

export default ChatRoom