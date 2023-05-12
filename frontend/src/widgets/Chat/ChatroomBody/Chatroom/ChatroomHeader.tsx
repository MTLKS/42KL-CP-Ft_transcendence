import React, { useContext } from 'react'
import { ImEarth } from 'react-icons/im'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import { ChatContext, ChatroomContentContext } from '../../../../contexts/ChatContext';
import ChatroomList from './ChatroomList';
import { FaUser } from 'react-icons/fa';

interface ChatroomHeaderProps {
  chatroomData: ChatroomData;
}

function ChatroomIcon(props: { isRoom: boolean }) {
  
  const { isRoom } = props;

  if (!isRoom) return (<FaUser className='text-base' />);

  return (<></>);
}

function ChatroomHeader(props: ChatroomHeaderProps) {

  const { chatroomData } = props;
  const { setChatBody } = useContext(ChatContext);

  return (
    <div className='h-fit w-full'>
      <ChatNavbar backAction={() => setChatBody(<ChatroomList />)}>
        <div className='w-3/5 py-2 px-4 text-dimshadow bg-highlight cursor-pointer mx-auto z-20' onClick={() => console.log(`see chat info`)}>
          <div className='flex flex-row items-center gap-3 w-fit mx-auto max-w-[90%]'>
            <p className='font-extrabold text-xl w-fit max-w-[90%] truncate'>{chatroomData.channelName}</p>
            <ChatroomIcon isRoom={chatroomData.isRoom} />
          </div>
        </div>
      </ChatNavbar>
    </div>
  )
}

export default ChatroomHeader