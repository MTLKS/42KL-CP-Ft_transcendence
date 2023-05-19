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
    <div className='text-highlight w-full h-full'>
      <ChatNavbar title="channel list" backAction={() => setChatBody(<ChatroomList />)} />
      <div className='mx-10 gap-y-4 h-full'>
        <ChatTableTitle title='channels (4)' searchable={true} setFilterKeyword={setFilterKeyword} />
        <div className='h-full w-full overflow-y-scroll'>
          {/** The channel list */}
          <Channel />
        </div>
      </div>
    </div>
  )
}

export default ChannelList