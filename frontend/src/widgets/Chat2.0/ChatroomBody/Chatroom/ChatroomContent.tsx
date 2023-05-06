import React from 'react'
import ChatNavbar from '../../ChatNavbar'
import ChatroomHeader from './ChatroomHeader'
import ChatroomMessage from './ChatroomMessage'
import ChatUnreadSeparator from './ChatUnreadSeparator'

function ChatroomContent() {
  return (
    <div className='w-full h-full flex flex-col'>
      <ChatroomHeader />
      <div className='flex flex-col overflow-scroll h-full w-full px-5 gap-y-4 scrollbar-hide'>
        <ChatroomMessage />
        {/** ChatroomMessages */}
      </div>
    </div>
  )
}

export default ChatroomContent