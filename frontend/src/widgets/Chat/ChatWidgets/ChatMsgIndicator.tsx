import React from 'react'

function ChatMsgIndicator() {
  return (
    <div className='rounded h-[30px] bg-accRed font-bold text-highlight text-sm animate-pulse px-2'>
      <p className='h-fit w-fit m-auto mt-1 font-extrabold text-base whitespace-pre'> Unread </p>
    </div>
  )
}

export default ChatMsgIndicator