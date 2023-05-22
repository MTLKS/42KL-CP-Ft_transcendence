import React, { useContext, useEffect } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext';
import NewChannel from './NewChannel';
import ChannelInfo from './ChannelInfo';
import ChannelMemberList from './ChannelMemberList';

function NewChatInfo() {

  const { state, dispatch } = useContext(NewChannelContext);
  const { setChatBody } = useContext(ChatContext);

  useEffect(() => {
    console.log("newchatinfo", state);
  }, [])

  return (
    <div className='flex flex-col'>
      <ChatNavbar
        title='channel info'
        backAction={() => setChatBody(<NewChannel />)}
        nextComponent={<ChatButton title='create' onClick={createChannel} />}
      />
      <ChannelInfo modifying={true} />
      <div className='w-full h-full mt-6'>
        <ChannelMemberList title="members" />
      </div>
    </div>
  )

  function createChannel() {
  }
}

export default NewChatInfo