import React, { useContext, useEffect, useState } from 'react'
import Chatroom from './Chatroom'
import ChatButton from '../../ChatWidgets/ChatButton'
import { HiServer } from 'react-icons/hi';
import { FaPlusSquare } from 'react-icons/fa'
import ChatEmptyState from '../../ChatEmptyState';
import NewChatRoom from '../CreateChat/NewChatRoom';
import { ChatContext, ChatroomsContext } from '../../../../contexts/ChatContext';
import UserContext from '../../../../contexts/UserContext';
import Chat from '../../Chat';

/**
 * @param prefix IntraId + '_tcr_'
 * @returns temporary chatrooms
 */
function getTemporaryChatrooms(prefix: string): string[] {

  const keys = Object.keys(localStorage);
  const prefixedKeys = keys.filter(key => key.startsWith(prefix));
  const chatrooms = prefixedKeys.map(key => localStorage.getItem(key) as string);
  return chatrooms;
}

function ChatroomList() {
  
  const { myProfile } = useContext(UserContext);
  const { setChatBody } = useContext(ChatContext);
  const [chatrooms, setChatrooms] = useState<TemporaryChatRoomData[]>([]);

  useEffect(() => {
    const chatrooms: TemporaryChatRoomData[] = [];
    // The process here should be:
    // 1. Get all chatrooms from the database
    // 2. Get all temporary chatrooms from the local storage
    // 3. Merge them together
    // 4. Sort them by the last message sent, if last message sent is not present, sort by the created date
    // 5. Set chatrooms state

    // Get temporary chatrooms (created by no message was sent yet). Should be deleted after the first message is sent.
    const temporaryChatrooms = getTemporaryChatrooms(`${myProfile.intraId.toString()}_tcr_`);
    temporaryChatrooms.forEach(chatroom => chatrooms.push(JSON.parse(chatroom)));
    chatrooms.sort((a, b) => {
      const createdDateA = new Date(a.createdAt);
      const createdDateB = new Date(b.createdAt);
      return createdDateB < createdDateA ? -1 : 1;
    })
    setChatrooms(chatrooms);
  }, []);

  return (
    <div className='flex flex-col border-box h-0 flex-1 relative'>
      { chatrooms.length > 0
        ? <div className='h-full w-full overflow-y-scroll scrollbar-hide'>{displayChatrooms()}</div>
        : <ChatEmptyState />
      }
      {
        chatrooms.length > 0 &&
        <div className='absolute bottom-0 right-0 flex flex-row gap-x-3.5 mb-5 mr-5 bg-transparent'>
          <ChatButton icon={<HiServer />} title="join channel" />
          <ChatButton icon={<FaPlusSquare />} title="new channel" onClick={() => setChatBody(<NewChatRoom type='channel' />)} />
          <ChatButton icon={<FaPlusSquare />} title="new chat" onClick={() => setChatBody(<NewChatRoom type='dm' chatrooms={chatrooms} />)} />
        </div>
      }
    </div>
  )

  function displayChatrooms() {
    return chatrooms.map(chatroom => <Chatroom key={chatroom.intraName+chatroom.createdAt} chatroomData={chatroom} />);
  }
}

export default ChatroomList