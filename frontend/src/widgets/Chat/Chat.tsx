import React, { useEffect, useState } from 'react'
import ChatToggle from './ChatToggle'
import ChatRoom from './ChatRoom';
import Room from './Room/Room';

const rooms: ChatRoomData[] = [
  {
    name: "bobo",
    id: ' 1',
    ownerId: '1',
    password: null,
    private: true,
  },
  {
    name: "zoro",
    id: ' 1',
    ownerId: '1',
    password: null,
    private: true,
  },
  {
    name: "bizarre group",
    id: ' 1',
    ownerId: '1',
    password: null,
    private: false,
  },
  {
    name: "janedoe",
    id: ' 1',
    ownerId: '1',
    password: null,
    private: true,
  },
]

const filtered: ChatRoomData[] = [];

function Chat() {
  const [expanded, setExpanded] = useState(false);
  const [chatOpened, setChatOpened] = useState<number | null>(null);
  const [filter, setFilter] = useState<boolean>(false);

  useEffect(() => {
    // console.log(filtered);
    setExpanded(expanded);
  }, [rooms]);

  return (
    <div className='flex flex-col select-none transition-all duration-300 overflow-hidden'
      style={expanded ? { height: "100%" } : { height: "60px" }}
    >
      <ChatToggle onClick={handleClick} expanded={expanded} onFilterUpdate={(word) => {
        filtered.splice(0, filtered.length);
        rooms.forEach((room) => {
          if (room.name.toLocaleLowerCase().includes(word.toLocaleLowerCase())) {
            filtered.push(room);
          }
        });
        if (word == "") setFilter(false);
        else setFilter(true);
      }} />
      {chatOpened == null ? <div className='overflow-y-scroll scrollbar-hide h-full transition-all duration-300 hidden'
        style={expanded ? { display: "block" } : { display: "none" }}>
        {
          (filter ? filtered : rooms).map((room, index) =>
            <ChatRoom roomData={room} key={index} onClick={() => handleChatOpened(index)} />)
        }
      </div> :
        <Room roomData={rooms[chatOpened]} closeChat={handleChatClosed} />
      }
    </div>
  )

  function handleClick() {
    setExpanded(!expanded);
  }

  function handleChatOpened(index: number) {
    setChatOpened(index);
  }

  function handleChatClosed() {
    setChatOpened(null);
  }
}

export default Chat