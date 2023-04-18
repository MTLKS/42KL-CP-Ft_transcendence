import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';

interface RoomHeaderProps {
  roomData: ChatRoomData;
  closeChat: () => void;
}

function RoomHeader(props: RoomHeaderProps) {
  const { roomData, closeChat } = props;
  const { name } = roomData;
  return (
    <div className='flex flex-row bg-highlight h-12'>
      <div className=' flex w-20 bg-highlight items-center mb-1'
        onClick={closeChat}
      >
      <FaArrowLeft className=' text-2xl mx-auto'/>
      </div>
      <div className='flex flex-row px-2 items-center w-full text-highlight bg-dimshadow mb-1'>
        <p className='uppercase font-extrabold text-xl'>
          {name}
        </p>
      </div>
    </div>
  )
}

export default RoomHeader