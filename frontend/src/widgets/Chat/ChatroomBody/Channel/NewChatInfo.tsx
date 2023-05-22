import React, { useContext, useEffect } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext';
import NewChannel from './NewChannel';
import ChannelInfo from './ChannelInfo';
import ChannelMemberList from './ChannelMemberList';
import { NewChannelError } from './newChannelReducer';

function NewChatInfo() {

  const { state, dispatch } = useContext(NewChannelContext);
  const { setChatBody } = useContext(ChatContext);

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
    const { channelName, password, errors, isPrivate } = state;
    let errorCount = 0;
  
    dispatch({ type: 'RESET_ERRORS' });

    if (!(channelName.length > 0 && channelName.length <= 16)) {
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_CHANNEL_NAME });
      errorCount++;
    }
    
    if (!isPrivate && password !== null && !(password.length > 0 && password.length <= 16)) {
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_PASSWORD });
      errorCount++;
    }

    if (errorCount !== 0) return ;

    dispatch({ type: 'CREATE_CHANNEL' });
  }
}

export default NewChatInfo