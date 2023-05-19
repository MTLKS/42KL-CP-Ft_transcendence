import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ChatroomHeader from './ChatroomHeader'
import ChatroomTextField from './ChatroomTextField'
import { ChatroomData, ChatroomMessageData, MemberData, NewMessageData } from '../../../../model/ChatRoomData';
import { getChatroomMessages, getMemberData } from '../../../../functions/chatAPIs';
import ChatroomMessage from './ChatroomMessage';
import UserContext from '../../../../contexts/UserContext';
import { ChatContext, ChatroomMessagesContext, ChatroomsContext } from '../../../../contexts/ChatContext';
import { playNewMessageSound } from '../../../../functions/audio';
import ChatUnreadSeparator from './ChatUnreadSeparator';

interface ChatroomContentProps {
  chatroomData: ChatroomData;
}

const MESSAGE_FETCH_LIMIT = 50;

// append new message but to the top of the list (index 0)
export function appendNewMessage(newMessage: ChatroomMessageData, messages: ChatroomMessageData[]) {
  const newMessages = [newMessage, ...messages];
  return newMessages;
}

function ChatroomContent(props: ChatroomContentProps) {

  const { chatroomData } = props;
  const { unreadChatrooms, setUnreadChatrooms } = useContext(ChatroomsContext);
  const { chatSocket } = useContext(ChatContext);
  const { myProfile } = useContext(UserContext);
  const [allMessages, setAllMessages] = useState<ChatroomMessageData[]>([]);
  const [isMessagesSet, setIsMessagesSet] = useState<boolean>(false);
  const [chatMemberLastRead, setChatMemberLastRead] = useState<string>('');
  const scrollToHereRef = useRef<HTMLDivElement>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [canBeFetched, setCanBeFetched] = useState<boolean>(true);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);

  useEffect(() => {
    // pop off this channel id from the list of unread channels
    if (unreadChatrooms.includes(chatroomData.channelId)) {
      const newUnreadChatrooms = unreadChatrooms.filter((channelId) => channelId !== chatroomData.channelId);
      setUnreadChatrooms(newUnreadChatrooms);
    }
    console.log("useffect []");
    // fetch message history
    fetchMessageHistory();
    // get chatroom member data
    getChatroomMemberData();
    // listen for incoming messages
    listenForIncomingMessages();
    // use to listen if the user scrolls up to the top of the chat
    const scrollableDiv = scrollableDivRef.current;
    scrollableDiv?.addEventListener('scroll', handleScrollToTop);

    return () => {
      chatSocket.removeListener("message");
      scrollableDiv?.removeEventListener('scroll', handleScrollToTop);
    }
  }, []);

  useEffect(() => {
    if (hasNewMessage) {
      scrollToHereRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      setHasNewMessage(false);
    }
  }, [hasNewMessage]);

  useEffect(() => {
    fetchMessageHistory();
  }, [isAtTop]);

  const messagesComponent = useMemo(() => {
    if (!chatMemberLastRead) return;
    return displayAllMessages();
  }, [allMessages.length, chatMemberLastRead]);

  return (
    <ChatroomMessagesContext.Provider value={{ messages: allMessages, setMessages: setAllMessages }}>
      <div className='w-full h-0 flex-1 flex flex-col box-border'>
        <ChatroomHeader chatroomData={chatroomData} />
        <div className='h-full overflow-y-scroll scrollbar-hide flex flex-col-reverse gap-y-4 px-5 pb-4 scroll-smooth box-border' ref={scrollableDivRef}>
          { messagesComponent }
        </div>
        <ChatroomTextField chatroomData={chatroomData} pingServer={pingServerToUpdateLastRead} setIsFirstLoad={setIsFirstLoad} />
      </div>
    </ChatroomMessagesContext.Provider>
  )

  function handleScrollToTop() {
    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      const isAtTop = (scrollableDiv.scrollHeight - scrollableDiv.clientHeight + scrollableDiv.scrollTop) === 0;
      setIsAtTop(isAtTop);
    }
  }

  async function fetchMessageHistory() {
    
    if (!canBeFetched) return;

    const fetchResult: ChatroomMessageData[] = (await getChatroomMessages(chatroomData.channelId, MESSAGE_FETCH_LIMIT, page)).data;
    if (fetchResult.length < MESSAGE_FETCH_LIMIT) {
      setCanBeFetched(false);
    }
    const allMessagesArray = [...fetchResult, ...allMessages];
    const sortedMsgs = allMessagesArray.sort((b, a) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());
    setAllMessages(sortedMsgs);
    setIsMessagesSet(true);
    setPage(page + 1);
  }

  async function getChatroomMemberData() {
    const memberData = (await getMemberData(chatroomData.channelId)).data as MemberData;
    setChatMemberLastRead(memberData.lastRead);
  }

  function pingServerToUpdateLastRead() {
    chatSocket.sendMessages("read", { channelId: chatroomData.channelId });
  }

  function listenForIncomingMessages() {
    chatSocket.listen("message", (newMessage: ChatroomMessageData) => {
      setAllMessages((messages) => appendNewMessage(newMessage, messages));
      playNewMessageSound();
    });
  }

  function displayAllMessages(){

    if (chatMemberLastRead === '' || !isMessagesSet) return [];

    const chatMemberLastReadTime = new Date(chatMemberLastRead);
    const oldMessages: ChatroomMessageData[] = allMessages.filter((message) => new Date(message.timeStamp) < chatMemberLastReadTime);
    const newMessages: ChatroomMessageData[] = allMessages.filter((message) => new Date(message.timeStamp) >= chatMemberLastReadTime);
    const messagesComponent: JSX.Element[] = [];
    let messageToDisplay: (string | ChatroomMessageData)[] = [];

    // if there's a new message, display a separator
    if (newMessages.length > 0 && isFirstLoad) {
      messageToDisplay = [...newMessages, "new", ...oldMessages];
    } else if (newMessages.length > 0 && !isFirstLoad) {
      messageToDisplay = [...newMessages, ...oldMessages];
    } else {
      messageToDisplay = oldMessages;
      setIsFirstLoad(false);
    }

    messageToDisplay.forEach((message) => {
      if (typeof message === "string" && message === "new") {
        messagesComponent.push(<div ref={scrollToHereRef} key={"separator_div" + new Date().toDateString()}><ChatUnreadSeparator key={"separator" + new Date().toISOString()}/></div>);
        setHasNewMessage(true);
      } else if (typeof message === "object")
        messagesComponent.push(<ChatroomMessage key={message.messageId + new Date().toDateString()} messageData={message} isMyMessage={myProfile.intraName === message.senderChannel.owner.intraName} />);
      }
    );
    pingServerToUpdateLastRead();
    return messagesComponent;
  }
}

export default ChatroomContent