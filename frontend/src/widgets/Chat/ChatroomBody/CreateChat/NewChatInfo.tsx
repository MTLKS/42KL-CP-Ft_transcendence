import React, { useContext } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext } from '../../../../contexts/ChatContext';
import NewChannel from './NewChannel';

function NewChatInfo() {

  const { setChatBody } = useContext(ChatContext);

  return (
    <div className='flex flex-col'>
      <ChatNavbar title='channel info' backAction={() => setChatBody(<NewChannel />)} nextComponent={<ChatButton title='create' />} />
    </div>
  )
}

export default NewChatInfo