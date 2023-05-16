import React, { useContext, useEffect, useState } from 'react'
import { FaPaperPlane, FaGamepad, FaPlusCircle } from 'react-icons/fa'
import { ChatContext, ChatroomMessagesContext } from '../../../../contexts/ChatContext';
import { ChatroomData, ChatroomMessageData } from '../../../../model/ChatRoomData';
import UserContext from '../../../../contexts/UserContext';

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

  useEffect(() => {
    if (textTooLong) {
      setTimeout(() => {
        setTextTooLong(false);
      }, 800);
    }
  }, [textTooLong]);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      
      e.preventDefault();
      
      if (message === '') return;

      chatSocket.sendMessages("message", {
        intraName: chatroomData.owner!.intraName,
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
        // channel: false, // considering DM only for now
        // channelId: chatroomData.channelId,
        isRoom: chatroomData.isRoom,
        message: message,
        messageId: new Date().getTime(),
        timeStamp: new Date().toISOString(),
        // user: myProfile,
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
  }

  return (
    <div className='w-full flex flex-row bg-dimshadow/0 items-end'>
      <div className='w-[80%] flex flex-row relative'>
        { isFocusing && <span className={`text-xs ${message.length === 1024 || textTooLong ? 'bg-accRed text-highlight' : 'bg-highlight text-dimshadow'} h-fit px-[1ch] font-bold absolute -top-3 right-16`}>{textTooLong ? "TEXT TOO LONG!" : `${message.length}/1024`}</span> }
        <textarea
          className='resize-none text-xl outline-none flex-1 border-highlight border-4 border-l-0 border-b-0 bg-dimshadow text-highlight p-3 scrollbar-hide whitespace-pre-line'
          rows={rows}
          value={message}
          onBlur={() => { setRows(1); setIsFocusing(false); }}
          onFocus={() => { setRows(previousRows); setIsFocusing(true); } }
          onChange={handleInput}
          onKeyDown={handleKeyPress}
        >
        </textarea>
        <button className='w-[60px] bg-highlight rounded-tr-md p-4' onClick={() => console.log(message)}>
          <FaPaperPlane className='text-dimshadow w-full h-full aspect-square text-3xl -ml-1' />
        </button>
      </div>
      <div className='w-[20%] h-[60px] px-4 bg-dimshadow'>
        <button className='bg-highlight w-full h-[60px] rounded-t-md px-3'>
          <span className='w-fit h-fit relative'>
            <FaGamepad className='w-fit h-full text-[53px] mx-auto text-dimshadow'/>
            <span className='rounded-full bg-highlight aspect-square absolute bottom-3 right-1 h-5 z-20 flex flex-row justify-evenly'>
              <FaPlusCircle className='h-full w-fullaspect-square text-accGreen rounded-full'/>
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default ChatroomTextField