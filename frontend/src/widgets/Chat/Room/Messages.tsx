import React, { useEffect, useRef, useState } from 'react'
import SrcollView from '../../../components/SrcollView';

const messages: ChatRoomMessageData[] = [
  {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'Wanna Play Another Round?',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'Sure. LOSER!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'SHUT THE * UP. THE REASON WHY I LOST THE LAST ROUND IS BECAUSE OF LAG. I\'ll let you know who the real PING PONG KING is!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'GAME ON. LOSER!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'Wanna Play Another Round?',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'Sure. LOSER!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'SHUT THE * UP. THE REASON WHY I LOST THE LAST ROUND IS BECAUSE OF LAG. I\'ll let you know who the real PING PONG KING is!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'GAME ON. LOSER!',
    timestamp: new Date(),
    channel: false,
  }, {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'Wanna Play Another Round?',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'Sure. LOSER!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'SHUT THE * UP. THE REASON WHY I LOST THE LAST ROUND IS BECAUSE OF LAG. I\'ll let you know who the real PING PONG KING is!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'GAME ON. LOSER!',
    timestamp: new Date(),
    channel: false,
  }, {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'Wanna Play Another Round?',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'Sure. LOSER!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'SHUT THE * UP. THE REASON WHY I LOST THE LAST ROUND IS BECAUSE OF LAG. I\'ll let you know who the real PING PONG KING is!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'GAME ON. LOSER!',
    timestamp: new Date(),
    channel: false,
  }, {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'Wanna Play Another Round?',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'Sure. LOSER!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '1',
    recieverId: '2',
    message: 'SHUT THE * UP. THE REASON WHY I LOST THE LAST ROUND IS BECAUSE OF LAG. I\'ll let you know who the real PING PONG KING is!',
    timestamp: new Date(),
    channel: false,
  },
  {
    messageId: '1',
    senderId: '2',
    recieverId: '1',
    message: 'GAME ON. LOSER!',
    timestamp: new Date(),
    channel: false,
  },
]

interface MessageProps {
  messageData: ChatRoomMessageData;
  align: 'start' | 'end';
}

function Message(props: MessageProps) {
  const { messageData, align } = props;
  return (
    <div className={`flex flex-col items-${align} text-highlight w-[80%]`}>
      <p className=' opacity-30'>
        {messageData.timestamp.toLocaleTimeString()}
      </p>
      <p>
        {messageData.message}
      </p>
    </div>
  )
}

interface MessagesProps {
  recieverId: string;
}

interface Size {
  width: number;
  height: number;
}

function Messages(props: MessagesProps) {
  const { recieverId } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!divRef.current) return;
    const currentDiv = divRef.current;
    const handleResize = () => {
      if (divRef.current) {
        setSize({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight,
        })
      }
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(currentDiv);
    handleResize();

    return () => observer.unobserve(currentDiv);
  }, []);

  return (
    <div className='flex-1 relative'
      ref={divRef}
    >
      <div className=' absolute top-0 left-0 overflow-auto flex flex-col scrollbar-hide'
        style={{ width: size.width, height: size.height }}
      >
        {messages.map((message, index) =>
          <Message messageData={message} key={index} align={message.senderId === recieverId ? 'end' : 'start'} />)}
      </div>
    </div>
  )
}

export default Messages