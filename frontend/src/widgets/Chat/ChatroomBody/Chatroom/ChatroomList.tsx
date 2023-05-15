import React, { useContext, useEffect, useState } from 'react'
import Chatroom from './Chatroom'
import ChatButton from '../../ChatWidgets/ChatButton'
import { HiServer } from 'react-icons/hi';
import { FaPlusSquare } from 'react-icons/fa'
import ChatEmptyState from '../../ChatEmptyState';
import NewChatRoom from '../CreateChat/NewChatRoom';
import { ChatContext, UnreadChatroomsContext } from '../../../../contexts/ChatContext';
import UserContext from '../../../../contexts/UserContext';
import { getChatroomList } from '../../../../functions/chatAPIs';
import { ChatroomData } from '../../../../model/ChatRoomData';
import { FriendsContext } from '../../../../contexts/FriendContext';

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

  const { chatSocket } = useContext(ChatContext);
  const { unreadChatrooms, setUnreadChatrooms } = useContext(UnreadChatroomsContext);
  const { myProfile } = useContext(UserContext);
  const { friends } = useContext(FriendsContext);
  const { setChatBody } = useContext(ChatContext);
  const [chatrooms, setChatrooms] = useState<ChatroomData[]>([]);


  useEffect(() => {
    const newUnreadChatrooms: number[] = [];
    chatSocket.listen("message", (data: any) => {
      if (unreadChatrooms.includes(data.channelId)) return;
      newUnreadChatrooms.push(data.channelId);
      setUnreadChatrooms(newUnreadChatrooms);
    });
  }, []);

  useEffect(() => {
    getAllChatrooms();
  }, [friends]);

  useEffect(() => {
    console.log("unreadchatrooms", unreadChatrooms);
  }, [unreadChatrooms]);

  return (
    <div className='flex flex-col border-box h-0 flex-1 relative'>
      {chatrooms.length > 0
        ? <div className='h-full w-full overflow-y-scroll scrollbar-hide'>{displayChatrooms()}</div>
        : <ChatEmptyState />
      }
      {
        chatrooms.length > 0 &&
        <div className='absolute bottom-0 right-0 flex flex-row gap-x-3.5 mb-5 mr-5 bg-transparent'>
          <ChatButton icon={<HiServer />} title="join channel" />
          <ChatButton icon={<FaPlusSquare />} title="new channel" onClick={() => setChatBody(<NewChatRoom type='channel' />)} />
        </div>
      }
    </div>
  )

  // this includes the chatrooms from the database and the temporary chatrooms that are temporary stored in the local storage
  async function getAllChatrooms() {

    const chatrooms: ChatroomData[] = [];

    const chatroomsFromDb = await getChatroomList();
    if (chatroomsFromDb.data.length > 0) {
      chatrooms.push(...chatroomsFromDb.data);
    }

    const temporaryChatrooms = getTemporaryChatrooms(`${myProfile.intraId.toString()}_tcr_`);
    temporaryChatrooms.forEach(chatroom => {
      const tempChatroomData = JSON.parse(chatroom);
      if (chatrooms.length > 0 && chatrooms.some(chatroom => chatroom.channelName === tempChatroomData.channelName && !chatroom.isRoom)) {
        localStorage.removeItem(`${myProfile.intraId.toString()}_tcr_${tempChatroomData.channelName}`);
        return ;
      } else {
        chatrooms.push(tempChatroomData);
      }
    });
    setChatrooms(chatrooms);
  }

  function displayChatrooms() {
    return chatrooms.map(chatroom => <Chatroom key={chatroom.channelName + chatroom.channelId} chatroomData={chatroom} hasUnReadMsg={unreadChatrooms && unreadChatrooms.includes(chatroom.channelId)} />);
  }
}

export default ChatroomList