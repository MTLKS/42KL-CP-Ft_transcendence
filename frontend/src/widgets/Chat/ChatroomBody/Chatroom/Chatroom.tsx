import React, { useContext } from 'react'
import { FaUser, FaUserSecret, FaUsers } from 'react-icons/fa'
import ChatMsgIndicator from '../../ChatWidgets/ChatMsgIndicator'
import { ChatContext } from '../../../../contexts/ChatContext';
import ChatroomContent from './ChatroomContent';
import { ChatroomData } from '../../../../model/ChatRoomData';
import { ImEarth } from 'react-icons/im';

interface ChatroomProps {
  hasUnReadMsg: boolean;
  chatroomData: ChatroomData;
}

function Chatroom(props: ChatroomProps) {

  const { chatroomData, hasUnReadMsg } = props;
  const { setChatBody } = useContext(ChatContext);

  return (
    <div
      className='h-14 w-full flex flex-row cursor-pointer group'
      onClick={() => setChatBody(<ChatroomContent chatroomData={chatroomData!} />)}
    >
      <div className={`${chatroomData.isRoom && 'p-3'} bg-highlight aspect-square h-full`}>
        {
          chatroomData.isRoom
            ? (chatroomData.isPrivate ? <FaUserSecret className='text-dimshadow w-full h-full' /> : <ImEarth className='text-dimshadow w-full h-full' />)
            : <img className="h-full aspect-square object-cover" src={chatroomData.owner!.avatar} alt={chatroomData.owner!.userName + `_avatar`} />
        }
      </div>
      <div className='border-box flex flex-row justify-between w-full items-center p-5 border-b-2 border-highlight/50'>
        <p className='text-highlight font-extrabold text-base truncate group-hover:underline'>{chatroomData.isRoom ? `${chatroomData.channelName}` : `${chatroomData.owner!.userName} (${chatroomData.owner!.intraName})`}</p>
        <ChatMsgIndicator hasNewMessage={hasUnReadMsg} />
      </div>
    </div>
  )
}

export default Chatroom