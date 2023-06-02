import React, { useContext, useState } from 'react'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import Channel from './Channel'
import { ChatContext } from '../../../../contexts/ChatContext';
import ChatroomList from '../Chatroom/ChatroomList';

function ChannelList() {

  const { setChatBody } = useContext(ChatContext);
  const [filterKeyword, setFilterKeyword] = useState("");

  return (
    <div className='w-full h-full text-highlight'>
      <ChatNavbar title="channel list" backAction={() => setChatBody(<ChatroomList />)} />
      <div className='h-full mx-10 gap-y-4'>
        <ChatTableTitle title='channels (4)' searchable={true} setFilterKeyword={setFilterKeyword} />
        <div className='w-full h-full overflow-y-scroll'>
          <Channel />
        </div>
      </div>
    </div>
  )
}

export default ChannelList