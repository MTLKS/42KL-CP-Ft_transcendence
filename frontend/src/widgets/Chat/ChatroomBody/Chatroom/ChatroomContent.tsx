import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatroomHeader from './ChatroomHeader'
import ChatroomTextField from './ChatroomTextField'
import { ChatroomData, ChatroomMessageData, MemberData, NewMessageData } from '../../../../model/ChatRoomData';
import { getChatroomMessages, getMemberData } from '../../../../functions/chatAPIs';
import ChatroomMessage from './ChatroomMessage';
import UserContext from '../../../../contexts/UserContext';
import { ChatContext, ChatroomMessagesContext } from '../../../../contexts/ChatContext';
import { UserData } from '../../../../model/UserData';

interface ChatroomContentProps {
  chatroomData: ChatroomData;
}

// append new message but to the top of the list (index 0)
export function appendNewMessage(newMessage: ChatroomMessageData, messages: ChatroomMessageData[]) {
  const newMessages = [newMessage, ...messages];
  return newMessages;
}

function ChatroomContent(props: ChatroomContentProps) {

  const { chatroomData } = props;
  const { chatSocket } = useContext(ChatContext);
  const { myProfile } = useContext(UserContext);
  const [unreadMessages, setUnreadMessages] = useState<ChatroomMessageData[]>([]);
  const [readMessages, setReadMessages] = useState<ChatroomMessageData[]>([]);
  const [allMessages, setAllMessages] = useState<ChatroomMessageData[]>([]);
  const [isMessagesSet, setIsMessagesSet] = useState<boolean>(false);
  const [chatMember, setChatMember] = useState<MemberData>();

  useEffect(() => {
    console.log(chatroomData.channelId);
    getChatroomMessages(chatroomData.channelId).then((res) => {
      const allMsgs = res.data as ChatroomMessageData[];
      console.log(allMsgs);
      const sortedMsgs = allMsgs.sort((b, a) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());
      // const unreadMsgs = sortedMsgs.filter((message) => !message.read && message.user.intraName !== myProfile.intraName);
      setAllMessages(sortedMsgs);
      setIsMessagesSet(true);
      // send the last message to the server so that it can be marked as read
      // unreadMsgs.forEach((message) => notifyServerOfUnreadMessage({ messageId: message.messageId, channelId: message.channelId }));
    });

    // getMemberData(chatroomData.channelId).then((res) => {
    //   const memberData = res.data as MemberData;
    //   console.log(memberData);
    //   setChatMember(memberData);
    // });
    // receive new Message and append
    chatSocket.listen("message", (newMessage: ChatroomMessageData) => {
      console.log("received new message: ", newMessage);
      setAllMessages((messages) => appendNewMessage(newMessage, messages));
    });
  }, []);

  if (!isMessagesSet) return null;

  // console.log(chatMember);

  return (
    <ChatroomMessagesContext.Provider value={{ messages: allMessages, setMessages: setAllMessages }}>
      <div className='w-full h-0 flex-1 flex flex-col box-border'>
        <ChatroomHeader chatroomData={chatroomData} />
        <div className='h-full overflow-scroll scrollbar-hide flex flex-col-reverse gap-y-4 px-5 pb-4'>
          { displayMessages() }
        </div>
        <ChatroomTextField chatroomData={chatroomData} />
      </div>
    </ChatroomMessagesContext.Provider>
  )

  function displayMessages() {
    return allMessages.map((message) => <ChatroomMessage key={message.timeStamp} messageData={message} isMyMessage={myProfile.intraName === message.user.intraName} />);
  }

  function notifyServerOfUnreadMessage(unreadMessage: { messageId: number, channelId: number }) {
    chatSocket.sendMessages("read", unreadMessage);
  }

}

export default ChatroomContent