import React, { useEffect, useRef, useState } from 'react'
import ScrollView from '../../../components/ScrollView';
import UnreadSep from './UnreadSep';

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
    <div className='flex flex-col text-highlight w-[80%] select-text'
      style={{ alignSelf: align === 'start' ? 'flex-start' : 'flex-end' }}
    >
      <p className='opacity-30'
        style={{ alignSelf: align === 'start' ? 'flex-start' : 'flex-end' }}
      >
        {messageData.timestamp.toLocaleTimeString()}
      </p>
      <p style={{ alignSelf: align === 'start' ? 'flex-start' : 'flex-end' }}>
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

  const message = [];

  const lastReadTime = new Date();

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].timestamp.getTime() > lastReadTime.getTime()) {
      message.push(<UnreadSep />)
    }
    message.push(<Message messageData={messages[i]} key={i} align={messages[i].senderId === recieverId ? 'end' : 'start'} />)
  }

  return (
    <div className='overflow-y-scroll flex flex-col scrollbar-hide p-3 flex-1 w-full box-border'>
      {message}
    </div>
  )
}

export default Messages