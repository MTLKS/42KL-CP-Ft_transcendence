import React from 'react'
import ChatroomHeader from './ChatroomHeader'
import ChatroomTextField from './ChatroomTextField'

interface ChatroomContentProps {
  chatroomData: TemporaryChatRoomData;
}

function ChatroomContent(props: ChatroomContentProps) {

  const { chatroomData } = props;

  return (
    <div className='w-full h-0 flex-1 flex flex-col box-border'>
      <ChatroomHeader chatroomData={chatroomData} />
      <div className='h-full overflow-scroll scrollbar-hide flex flex-col gap-y-4 px-5 pb-4'>
        { /** Chat messages here */}
      </div>
      <ChatroomTextField chatroomData={chatroomData} />
    </div>
  )
}

export default ChatroomContent