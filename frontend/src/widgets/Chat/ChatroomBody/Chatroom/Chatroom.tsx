import React, { useContext } from 'react'
import { FaUser, FaUsers } from 'react-icons/fa'
import ChatMsgIndicator from '../../ChatWidgets/ChatMsgIndicator'
import { ChatContext } from '../../../../contexts/ChatContext';
import ChatroomContent from './ChatroomContent';
import { ChatroomData } from '../../../../model/ChatRoomData';

interface ChatroomProps {
  chatroomData: ChatroomData;
}

function Chatroom(props: ChatroomProps) {

  const { chatroomData } = props;
  const { setChatBody } = useContext(ChatContext);

  return (
    <div
      className='h-14 w-full flex flex-row cursor-pointer group'
      onClick={() => setChatBody(<ChatroomContent chatroomData={chatroomData!} />)}
    >
      <div className={`${chatroomData.isRoom && 'p-3'} bg-highlight aspect-square h-full`}>
        {
          chatroomData.isRoom
            ? <FaUsers className='w-full h-full text-dimshadow' />
            : <img src={chatroomData.owner!.avatar} alt={chatroomData.owner!.userName + `_avatar`} />
        }
        {/** TODO: Change icon based on the chatroom type "isRoom" */}
      </div>
      <div className='border-box flex flex-row justify-between w-full items-center p-5 border-b-2 border-highlight/50'>
        <p className='text-highlight font-extrabold text-base truncate group-hover:underline'>{chatroomData.owner!.userName} ({chatroomData.owner!.intraName})</p>
        <ChatMsgIndicator />
      </div>
    </div>
  )
}

export default Chatroom