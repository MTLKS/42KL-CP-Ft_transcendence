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
    <div className='flex flex-col select-none transition-all duration-300'
      style={expanded ? { height: "100%" } : { height: "80px" }}
    >
      <ChatToggle onClick={handleClick} />
      <div className='overflow-y-scroll scrollbar-hide transition-all duration-300 hidden'
        style={expanded ? { display: "block" } : { display: "none" }}>
        {/* block might cause issue */}
        {
          rooms.map((room, index) => <ChatRoom name={room.name} key={index} />)
        }
      </div>
    </div>
  )

  function handleClick() {
    setExpanded(!expanded);
  }
}

export default Chat