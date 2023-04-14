import React from 'react'

interface RoomHeaderProps {
  roomData: ChatRoomData;
  closeChat: () => void;
}

function RoomHeader(props: RoomHeaderProps) {
  const { roomData, closeChat } = props;
  const { name } = roomData;
  return (
    <div className='flex flex-row bg-highlight h-16'>
      <div className=' w-20  bg-highlight'
        onClick={closeChat}
      >
      </div>
      <div className='flex flex-row px-2 items-center w-full text-highlight bg-dimshadow mb-1'>
        <p className='capitalize '>
          {name}
        </p>
      </div>
    </div>
  )
}

export default RoomHeader