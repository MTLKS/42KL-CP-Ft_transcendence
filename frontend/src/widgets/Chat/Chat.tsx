import React, { useState } from 'react'
import ChatToggle from './ChatToggle'
import ChatRoom from './ChatRoom';
import Room from './Room/Room';

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
  const [chatOpened, setChatOpened] = useState<number | null>(null);

  return (
    <div className='flex flex-col select-none transition-all duration-300 pb-5'
      style={expanded ? { height: "100%" } : { height: "60px" }}
    >
      <ChatToggle onClick={handleClick} />
      {chatOpened == null ? <div className='overflow-y-scroll scrollbar-hide h-full transition-all duration-300 hidden'
        style={expanded ? { display: "block" } : { display: "none" }}>
        {
          rooms.map((room, index) =>
            <ChatRoom name={room.name} roomType={room.type} key={index} />)
        }
      </div> : <Room />}
    </div>
  )

  function handleClick() {
    setExpanded(!expanded);
  }

  function handleChatOpened(index: number) {
    console.log(index);
    setChatOpened(index);
  }
}

export default Chat