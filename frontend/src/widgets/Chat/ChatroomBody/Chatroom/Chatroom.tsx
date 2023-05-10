import React, { useContext } from 'react'
import { FaUser } from 'react-icons/fa'
import ChatMsgIndicator from '../../ChatWidgets/ChatMsgIndicator'
import { ChatContext } from '../../../../contexts/ChatContext';
import ChatroomContent from './ChatroomContent';

interface ChatroomProps {
  chatroomData?: TemporaryChatRoomData;
}

function Chatroom(props: ChatroomProps) {

  const { chatroomData } = props;
  const { setChatBody } = useContext(ChatContext);

  return (
    <div
      className='h-14 w-full flex flex-row cursor-pointer group'
      onClick={() => setChatBody(<ChatroomContent chatroomData={chatroomData!} />)}
    >
      <div className='p-3 bg-highlight aspect-square h-full'>
        {/** TODO: Change icon based on the chatroom type "isRoom" */}
        <FaUser className='w-full h-full text-dimshadow' />
      </div>
      <div className='border-box flex flex-row justify-between w-full items-center p-5 border-b-2 border-highlight/50'>
        <p className='text-highlight font-extrabold text-base w-[20ch] truncate group-hover:underline'>{chatroomData?.intraName}</p>
        {/* <ChatMsgIndicator total={1} /> */}
      </div>
    </div>
  )
}

export default Chatroom