import React, { useContext, useEffect, useState } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChannelMemberList from './ChannelMemberList'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext } from '../../../../contexts/ChatContext'
import ChatroomContent from '../Chatroom/ChatroomContent'
import ChannelInfoForm from './ChannelInfoForm'
import { ChatroomData } from '../../../../model/ChatRoomData'

interface ChannelInfoProps {
  chatroomData: ChatroomData;
}

function ChannelInfo(props: ChannelInfoProps) {

  const { chatroomData } = props;
  const { setChatBody } = useContext(ChatContext);
  const [modifying, setModifying] = useState(false);
  const [chatButton, setChatButton] = useState<React.ReactNode>(<></>);

  useEffect(() => {
    if (modifying)
      setChatButton(<ChatButton title='save' onClick={() => console.log('hello')} />)
    else
      setChatButton(<></>);
  }, [modifying]);

  return (
    <div className='flex flex-col'>
      <ChatNavbar
        title='channel info'
        backAction={() => setChatBody(<ChatroomContent chatroomData={chatroomData} />)}
        nextComponent={chatButton}
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
}

export default ChannelInfo