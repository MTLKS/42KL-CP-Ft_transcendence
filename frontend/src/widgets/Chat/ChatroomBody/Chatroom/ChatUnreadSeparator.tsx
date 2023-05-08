import React from 'react'

function ChatUnreadSeparator() {
  return (
    <div className='w-full h-fit flex flex-row items-center'>
      <div className='w-full h-1 bg-highlight'></div>
      <p className='mx-4 font-extrabold text-base text-highlight'>NEW</p>
      <div className='w-full h-1 bg-highlight'></div>
    </div>
  )
}

export default ChatUnreadSeparator