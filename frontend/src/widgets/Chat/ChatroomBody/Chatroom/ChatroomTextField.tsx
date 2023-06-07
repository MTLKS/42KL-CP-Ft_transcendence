import React, { useContext, useEffect, useState } from 'react'
import { FaPaperPlane, FaGamepad, FaPlusCircle } from 'react-icons/fa'
import { ChatContext, ChatroomMessagesContext } from '../../../../contexts/ChatContext';
import { ChannelData, ChatroomData, ChatroomMessageData } from '../../../../model/ChatRoomData';
import UserContext from '../../../../contexts/UserContext';
import ChatroomTypingStatus from './ChatroomTypingStatus';

interface ChatroomTextFieldProps {
  chatroomData: ChatroomData;
  pingServer: () => void;
  setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatroomTextField(props: ChatroomTextFieldProps) {

  const { chatroomData, pingServer, setIsFirstLoad } = props;
  const { chatSocket } = useContext(ChatContext);
  const { messages, setMessages } = useContext(ChatroomMessagesContext);
  const { myProfile } = useContext(UserContext);
  const [previousRows, setPreviousRows] = useState(1);
  const [rows, setRows] = useState(1);
  const [message, setMessage] = useState('');
  const [isFocusing, setIsFocusing] = useState(false);
  const [textTooLong, setTextTooLong] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [someoneIsTyping, setSomeoneIsTyping] = useState(false);
  const [typingMembers, setTypingMembers] = useState<string[]>([]);

  useEffect(() => {
    // listen for member typing
    listenForMemberTyping();
    return () => {
      chatSocket.removeListener("typing");
    }
  }, []);

  useEffect(() => {
    if (textTooLong) {
      setTimeout(() => {
        setTextTooLong(false);
      }, 800);
    }
  }, [textTooLong]);

  useEffect(() => {
    if (isTyping || message.length === 0) return ;
    
    if (!isTyping) setIsTyping(true);
    chatSocket.sendMessages("typing", { channelId: chatroomData.channelId });
  }, [message]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        setIsTyping(false);
      }, 5000);
    }
  }, [isTyping]);

  useEffect(() => {
    if (someoneIsTyping) {
      setTimeout(() => {
        setSomeoneIsTyping(false);
        setTypingMembers([]);
      }, 5000);
    }
  }, [someoneIsTyping]);

  const listenForMemberTyping = () => {
    chatSocket.listen("typing", (data: ChannelData) => {
      console.log(data);
      if (data.channelId !== chatroomData.channelId) return ;
      const typist = data.owner.userName;
      if (typingMembers.includes(typist)) return;
      setTypingMembers([...typingMembers, typist]);
      setSomeoneIsTyping(true);
    })
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { scrollHeight, clientHeight, value } = e.target;

    if (value.length > 1024) {
      setMessage(value.slice(0, 1024));
      setTextTooLong(true);
      return;
    };

    if (value === '') {
      setRows(1);
      setPreviousRows(1);
      setMessage(value);
      return;
    }

    if (scrollHeight > clientHeight) {
      const newRows = rows === 3 ? 3 : rows + 1;
      setRows(newRows);
      setPreviousRows(newRows);
    }
    setMessage(value);
  }

  const sendMessage = () => {
    if (message === '') return;

      chatSocket.sendMessages("message", {
        channelId: chatroomData.channelId,
        message: message,
      });
      // append new message to the top of the list (index 0)
      const newMessage: ChatroomMessageData = {
        senderChannel: {
          owner: myProfile,
          channelName: myProfile.intraName,
          isPrivate: true,
          isRoom: false,
          channelId: myProfile.intraId,
          password: null
        },
        receiverChannel: {
          owner: chatroomData.owner!,
          channelName: chatroomData.channelName,
          isPrivate: chatroomData.isPrivate,
          isRoom: chatroomData.isRoom,
          channelId: chatroomData.channelId,
          password: chatroomData.password,
        },
        isRoom: chatroomData.isRoom,
        message: message,
        messageId: new Date().getTime(),
        timeStamp: new Date().toISOString(),
      };
      const newMessages = [
        newMessage,
        ...messages,
      ];
      setMessages(newMessages);
      setMessage('');
      setRows(1);
      setIsFirstLoad(false);
      pingServer();
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className='w-full h-[60px] flex flex-row bg-dimshadow/0 items-end'>
      <div className='w-[80%] h-full flex flex-row relative'>
        { isFocusing && <span className={`text-xs ${message.length === 1024 || textTooLong ? 'bg-accRed text-highlight' : 'bg-highlight text-dimshadow'} h-fit px-[1ch] font-bold absolute -top-3 right-16`}>{textTooLong ? "TEXT TOO LONG!" : `${message.length}/1024`}</span> }
        {
          someoneIsTyping &&
          <div className='absolute -top-4'>
            <ChatroomTypingStatus typingMembers={typingMembers} />
          </div>
        }
        <textarea
          className='flex-1 p-3 text-xl whitespace-pre-line border-4 border-b-0 border-l-0 outline-none resize-none border-highlight bg-dimshadow text-highlight scrollbar-hide cursor-text selection:bg-highlight selection:text-dimshadow'
          rows={rows}
          value={message}
          onBlur={() => { setRows(1); setIsFocusing(false); }}
          onFocus={() => { setRows(previousRows); setIsFocusing(true); } }
          onChange={handleInput}
          onKeyDown={handleKeyPress}
        >
        </textarea>
        <button className='w-[60px] bg-highlight rounded-tr-md p-4 cursor-pointer' onClick={sendMessage}>
          <FaPaperPlane className='w-full h-full -ml-1 text-3xl text-dimshadow aspect-square' />
        </button>
      </div>
      <div className='w-[20%] h-[60px] px-4 bg-dimshadow'>
        <button className='bg-highlight w-full h-[60px] rounded-t-md px-3 cursor-pointer'>
          <span className='relative w-fit h-fit'>
            <FaGamepad className='w-fit h-full text-[53px] mx-auto text-dimshadow'/>
            <span className='absolute z-20 flex flex-row h-5 rounded-full bg-highlight aspect-square bottom-3 right-1 justify-evenly'>
              <FaPlusCircle className='h-full rounded-full w-fullaspect-square text-accGreen'/>
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default ChatroomTextField