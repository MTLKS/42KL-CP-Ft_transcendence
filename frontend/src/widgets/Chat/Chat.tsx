import React, { useState } from 'react'
import ChatToggle from './ChatToggle'
import ChatRoom from './ChatRoom';

const rooms = [
  {
    name: "bobo",
    type: "private",
  },
  {
    name: "zoro",
    type: "private",
  },
  {
    name: "bizarre group",
    type: "group",
  },
  {
    name: "janedoe",
    type: "private",
  },
]

function Chat() {

  const [expanded, setExpanded] = useState(false);
  const [chatOpened, setChatOpened] = useState(0);

  return (
    <div className='flex flex-col select-none transition-all duration-300 pb-5'
      style={expanded ? { height: "100%" } : { height: "60px" }}
    >
      <ChatToggle onClick={handleClick} />
      <div className='overflow-y-scroll scrollbar-hide transition-all duration-300 hidden'
        style={expanded ? { display: "block" } : { display: "none" }}>
        {
          rooms.map((room, index) =>
            <ChatRoom name={room.name} roomType={room.type} key={index} />)
        }
      </div>
    </div>
  )

  function handleClick() {
    setExpanded(!expanded);
  }
}

export default Chat