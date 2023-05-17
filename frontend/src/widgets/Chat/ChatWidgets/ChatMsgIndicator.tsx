import React from 'react'

function ChatMsgIndicator(props: { hasNewMessage: boolean }) {

  const { hasNewMessage } = props;

  return (
    <div className={`rounded h-[30px] bg-accRed font-bold text-highlight text-sm animate-pulse px-2 ${hasNewMessage ? 'block' : 'hidden'}`}>
      <p className='h-fit w-fit m-auto mt-1 font-extrabold text-base whitespace-pre uppercase'> Unread </p>
    </div>
  )
}

export default ChatMsgIndicator