import React, { useContext, useEffect } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext';
import NewChannel from './NewChannel';
import { NewChannelAction, NewChannelState } from './newChannelReducer';
import ChannelInfo from './ChannelInfo';
import ChannelMemberList from './ChannelMemberList';

interface NewChatInfoProps {
  state: NewChannelState,
  dispatch: React.Dispatch<NewChannelAction>,
}

function NewChatInfo(props: NewChatInfoProps) {

  const { state, dispatch } = props;
  const { setChatBody } = useContext(ChatContext);

  return (
    <div className='flex flex-col'>
      <ChatNavbar
        title='channel info'
        backAction={() => setChatBody(<NewChannel oldState={state} oldDispatch={dispatch}/>)}
        nextComponent={<ChatButton title='create' />}
      />
      <ChannelInfo modifying={true} state={state} dispatch={dispatch} />
      <div className='w-full h-full mt-6'>
        <ChannelMemberList title="members" state={state} dispatch={dispatch} />
      </div>
    </div>
  )
}

export default NewChatInfo