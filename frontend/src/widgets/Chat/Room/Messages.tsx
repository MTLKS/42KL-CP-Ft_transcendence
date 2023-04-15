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
    <div className={`flex flex-col self-${align} text-highlight w-[80%] m-3 select-text`}>
      <p className={`opacity-30 self-${align}`}>
        {messageData.timestamp.toLocaleTimeString()}
      </p>
      <p className={`self-${align}`}>
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

  return (
    <div className='overflow-y-scroll flex flex-col scrollbar-hide flex-1 h-0'>
      {messages.map((message, index) =>
        <Message messageData={message} key={index} align={message.senderId === recieverId ? 'end' : 'start'} />)}
    </div>
  )
}

export default Messages