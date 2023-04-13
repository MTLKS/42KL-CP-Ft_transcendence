import React, { useState } from 'react'
import ChatToggle from './ChatToggle'
import ChatRoom from './ChatRoom';

const rooms = [
  {
    name: "bobo"
  },
  {
    name: "zoro"
  },
  {
    name: "bizarre group"
  },
  {
    name: "janedoe"
  },
]

function Chat() {

  const [expanded, setExpanded] = useState(false);
  const [chatOpened, setChatOpened] = useState(0);

  return (
    <div className='flex flex-col h-fit select-none'>
      <ChatToggle onClick={handleClick}/>
      <div className={`${expanded ? '' : 'hidden'} overflow-auto scrollbar-hide`}>
        {/* block might cause issue */}
        {
          rooms.map((room, index) => <ChatRoom name={room.name} />)
        }
      </div>
    </div>
  )

  function handleClick() {
    setExpanded(!expanded);
  }
}

export default Chat