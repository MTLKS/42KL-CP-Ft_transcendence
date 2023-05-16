import React, { useContext, useEffect, useMemo, useState } from 'react'
import ChatToggle from './ChatWidgets/ChatToggle'
import ChatroomList from './ChatroomBody/Chatroom/ChatroomList';
import { ChatContext, ChatroomsContext } from '../../contexts/ChatContext';
import SocketApi from '../../api/socketApi';
import { ChatroomMessageData } from '../../model/ChatRoomData';
import { getFriendList } from '../../functions/friendlist';
import { FriendsContext } from '../../contexts/FriendContext';

const CHAT_SOCKET_NAMESPACE = "/chat";

function Chat() {

  const { setFriends } = useContext(FriendsContext);
  const [unreadChatrooms, setUnreadChatrooms] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [chatroomBody, setChatroomBody] = useState(<ChatroomList />);
  const chatSocket = useMemo(() => new SocketApi(CHAT_SOCKET_NAMESPACE), []);

  useEffect(() => {
    // for receive new message
    const newUnreadChatrooms: number[] = [];
    chatSocket.connect();
    chatSocket.listen("message", (data: ChatroomMessageData) => {
      if (unreadChatrooms.includes(data.senderChannel.channelId)) return;
      newUnreadChatrooms.push(data.senderChannel.channelId);
      setUnreadChatrooms(newUnreadChatrooms);
    });
    return () => chatSocket.removeListener("message");
  }, []);

  useEffect(() => {
    if (expanded) getFriendList().then(friends => setFriends(friends.data));
  }, [expanded]);

  // toggle chat
  const handleToggleChat = () => setExpanded(!expanded);

  return (
    <ChatroomsContext.Provider value={{ unreadChatrooms: unreadChatrooms, setUnreadChatrooms: setUnreadChatrooms }}>
      <ChatContext.Provider value={{ chatSocket: chatSocket, chatBody: chatroomBody, setChatBody: setChatroomBody}}>
        <div className={`flex flex-col select-none transition-all duration-300 overflow-hidden ${expanded ? 'h-full' : 'h-[60px]'} box-border`}>
          <ChatToggle toggleChat={handleToggleChat} expanded={expanded} hasNewMessage={unreadChatrooms.length > 0} />
          {chatroomBody}
        </div>
      </ChatContext.Provider>
    </ChatroomsContext.Provider>
  )
}

export default Chat