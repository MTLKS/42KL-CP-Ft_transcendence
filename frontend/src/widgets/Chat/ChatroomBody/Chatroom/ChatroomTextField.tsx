import React, { useContext, useEffect, useState } from 'react'
import { FaPaperPlane, FaGamepad, FaPlusCircle } from 'react-icons/fa'
import { ChatContext } from '../../../../contexts/ChatContext';

interface ChatroomTextFieldProps {
  chatroomData: TemporaryChatRoomData;
}

function ChatroomTextField(props: ChatroomTextFieldProps) {

  const { chatroomData } = props;
  const { chatSocket } = useContext(ChatContext);
  const [previousRows, setPreviousRows] = useState(1);
  const [rows, setRows] = useState(1);
  const [message, setMessage] = useState('');

  // when user types in the textfield, if the current line exceeds the textfield's width, add a new line
  // if the user delete one line, remove the line
  // max rows is 3
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { scrollHeight, clientHeight, value } = e.target;

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
      chatSocket.sendMessages("sendMessage", {
        intraName: chatroomData.intraName,
        message: message,
      })
      chatSocket.listen("sendMessage", (data: any) => {
        console.log("received new message: ", data);
      });
      setMessage('');
    }
  }

  return (
    <div className='w-full flex flex-row bg-dimshadow/0 items-end'>
      <div className='w-[80%] flex flex-row'>
        <textarea
          className='resize-none text-xl outline-none flex-1 border-highlight border-4 border-l-0 border-b-0 bg-dimshadow text-highlight p-3 scrollbar-hide whitespace-pre-line'
          rows={rows}
          value={message}
          onBlur={() => setRows(1)}
          onFocus={() => setRows(previousRows)}
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
          <span className='w-fit h-fit relative animate-pulse'>
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