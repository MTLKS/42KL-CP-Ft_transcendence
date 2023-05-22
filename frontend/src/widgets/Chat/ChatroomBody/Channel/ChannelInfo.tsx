import React, { useContext, useEffect, useState } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChannelMemberList from './ChannelMemberList'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext'
import ChatroomContent from '../Chatroom/ChatroomContent'
import ChannelInfoForm from './ChannelInfoForm'
import { ChatroomData } from '../../../../model/ChatRoomData'

interface ChannelInfoProps {
  chatroomData: ChatroomData;
}

function ChannelInfo(props: ChannelInfoProps) {

  const { chatroomData } = props;
  const { setChatBody } = useContext(ChatContext);
  const { state, dispatch } = useContext(NewChannelContext);
  const [modifying, setModifying] = useState(false);

  return (
    <div className='flex flex-col'>
      <ChatNavbar
        title='channel info'
        backAction={() => setChatBody(<ChatroomContent chatroomData={chatroomData} />)}
        nextComponent={modifying ? <ChatButton title='save' onClick={saveChannelEdits} /> : <></>}
      />
      <ChannelInfoForm modifying={modifying} setModifyChannel={modifyChannel} />
      <div className='w-full h-full mt-6'>
        <ChannelMemberList title="members" />
      </div>
    </div>
  )

  function modifyChannel() {
    setModifying(!modifying);
  }

  function saveChannelEdits() {
    console.log("channel info: ", state);
    // patch updated info to server
    // catch errors
  }
}

export default ChannelInfo