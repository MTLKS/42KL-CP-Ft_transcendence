import React from 'react'

interface ChatRoomProps {
  name: string,
  newMessage?: boolean
}

function ChatRoom(props: ChatRoomProps) {
  
  const { name, newMessage } = props;
  
  return (
    <div className='flex flex-row cursor-pointer p-6 bg-dimshadow text-highlight font-extrabold text-2xl uppercase border-b-4 border-highlight items-center justify-between'>
      <p>{name}</p>
      <div className='h-6 w-6 rounded-full bg-accRed animate-ping hidden'></div>
    </div>
  )
}

export default ChatRoom