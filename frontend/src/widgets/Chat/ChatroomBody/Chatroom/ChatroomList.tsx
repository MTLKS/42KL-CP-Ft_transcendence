import React, { useContext, useEffect, useReducer, useState } from 'react'
import Chatroom from './Chatroom'
import ChatButton from '../../ChatWidgets/ChatButton'
import { HiServer } from 'react-icons/hi';
import { FaPlusSquare } from 'react-icons/fa'
import ChatEmptyState from '../../ChatEmptyState';
import NewChannel from '../Channel/NewChannel';
import { ChatContext, ChatroomsContext, NewChannelContext } from '../../../../contexts/ChatContext';
import { getChatroomList } from '../../../../api/chatAPIs';
import { ChatroomData, ChatroomMessageData } from '../../../../model/ChatRoomData';
import { FriendsContext } from '../../../../contexts/FriendContext';
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle';
import ChannelList from '../Channel/ChannelList';
import newChannelReducer, { newChannelInitialState } from '../Channel/newChannelReducer';

function ChatroomList() {

  const { chatSocket, expanded } = useContext(ChatContext);
  const { unreadChatrooms, setUnreadChatrooms } = useContext(ChatroomsContext);
  const { friends } = useContext(FriendsContext);
  const { setChatBody } = useContext(ChatContext);
  const [chatrooms, setChatrooms] = useState<ChatroomData[]>([]);
  const [filterKeyword, setFilterKeyword] = useState("");

  useEffect(() => {
    const newUnreadChatrooms: number[] = [...unreadChatrooms];
    chatSocket.listen("message", (data: ChatroomMessageData) => {
      getAllChatrooms();
      if (unreadChatrooms.includes(data.senderChannel.channelId)) return;
      newUnreadChatrooms.push(data.senderChannel.channelId);
      setUnreadChatrooms(newUnreadChatrooms);
    });
    return () => chatSocket.removeListener("message");
  }, []);

  useEffect(() => {
    getAllChatrooms();
  }, [friends]);

  useEffect(() => {
    const newUnreadChatrooms: number[] = [...unreadChatrooms];
    chatrooms.forEach(chatroom => {
      if (chatroom.newMessage && !unreadChatrooms.includes(chatroom.channelId))
        newUnreadChatrooms.push(chatroom.channelId);
    });
    setUnreadChatrooms(newUnreadChatrooms);
  }, [chatrooms]);

  return (
    <div className={`relative ${expanded ? 'flex' : 'hidden'} flex-col flex-1 h-0 border-box`}>
      {chatrooms.length > 0
        ? displayChatroomListBody()
        : <ChatEmptyState />
      }
      {
        chatrooms.length > 0 &&
        <div className='absolute bottom-0 right-0 flex flex-row gap-x-3.5 mb-5 mr-5 bg-transparent'>
          <ChatButton icon={<HiServer />} title="join channel" onClick={() => setChatBody(<ChannelList />)} />
          <ChatButton icon={<FaPlusSquare />} title="new channel" onClick={() => setChatBody(<NewChannel />)} />
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
    setChatrooms(chatrooms);
  }

  function displayChatrooms() {
    let filteredChatrooms: ChatroomData[] = [];
    if (filterKeyword === "")
      filteredChatrooms = chatrooms;
    else {
      filteredChatrooms = chatrooms.filter(chatroom => {
        if (chatroom.channelName.toLowerCase().startsWith(filterKeyword.toLowerCase())
          || chatroom.owner?.intraName.toLowerCase().startsWith(filterKeyword.toLowerCase())
          || chatroom.owner?.userName.toLowerCase().startsWith(filterKeyword.toLowerCase()))
          return true;
        return false;
      })
    }
    return filteredChatrooms.map(chatroom => <Chatroom key={chatroom.channelName + chatroom.channelId} chatroomData={chatroom} hasUnReadMsg={unreadChatrooms && unreadChatrooms.includes(chatroom.channelId)} />);
  }

  function displayChatroomListBody() {
    return (
      <div className='w-full h-full'>
        <div className='px-4 py-3'>
          <ChatTableTitle title={`Chatrooms`} searchable={true} setFilterKeyword={setFilterKeyword} />
        </div>
        <div className='w-full h-full overflow-y-scroll scrollbar-hide'>
          {displayChatrooms()}
        </div>
      </div>
    )
  }
}

export default ChatroomList