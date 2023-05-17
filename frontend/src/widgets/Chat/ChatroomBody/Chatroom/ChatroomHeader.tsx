import React, { useContext, useState } from 'react'
import { ImEarth } from 'react-icons/im'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import { ChatContext, ChatroomContentContext } from '../../../../contexts/ChatContext';
import ChatroomList from './ChatroomList';
import { FaUser } from 'react-icons/fa';
import { ChatroomData } from '../../../../model/ChatRoomData';
import PreviewProfileContext from '../../../../contexts/PreviewProfileContext';
import Profile from '../../../Profile/Profile';

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
  const { setPreviewProfileFunction, setTopWidgetFunction } = useContext(PreviewProfileContext);
  const { setChatBody } = useContext(ChatContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='h-fit w-full'>
      <ChatNavbar backAction={closeChatroom}>
        <div className='w-3/5 py-2 px-4 text-dimshadow bg-highlight cursor-pointer mx-auto z-20 border-highlight border-2 group hover:bg-dimshadow hover:text-highlight transition-all duration-150' onClick={checkChannelInfo}>
          <div className='flex flex-row items-center gap-3 w-fit mx-auto max-w-[90%]'>
            <p className='font-extrabold text-xl w-fit max-w-[90%] truncate'>{chatroomData.channelName}</p>
            <ChatroomIcon isRoom={chatroomData.isRoom} />
          </div>
        </div>
      </ChatNavbar>
    </div>
  )

  function checkChannelInfo() {
    if (chatroomData.isRoom) {
      // TODO: open room info
    } else {
      setPreviewProfileFunction(chatroomData.owner!);
      setTopWidgetFunction(<Profile expanded={!expanded} />);
      setExpanded(!expanded);
    }
  }

  function closeChatroom() {
    setChatBody(<ChatroomList />);
  }
}

export default ChatroomHeader