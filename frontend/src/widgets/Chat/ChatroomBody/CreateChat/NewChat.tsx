import React, { useContext, useEffect, useMemo } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChatButton from '../../ChatWidgets/ChatButton'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatMember from '../ChatMember'
import { FriendsContext } from '../../../../contexts/FriendContext'
import { ChatContext } from '../../../../contexts/ChatContext'
import ChatroomList from '../Chatroom/ChatroomList'

function NewChat() {

  const { setChatBody } = useContext(ChatContext);
  const { friends } = useContext(FriendsContext);
  const acceptedFriends = useMemo(() => friends.filter(friend => friend.status.toLowerCase() === 'accepted'), [friends]);

  return (
    <div className='w-full h-full'>
      <ChatNavbar title='new chat' nextComponent={<ChatButton title='create' />} backAction={() => setChatBody(<ChatroomList />)} />
      <div className='w-[95%] h-full mx-auto'>
        <ChatTableTitle title={`friends (${acceptedFriends.length})`} searchable={true} />
        <div className='w-full h-full overflow-y-scroll flex flex-col gap-y-2.5'>
          { acceptedFriends.map(friend => (<ChatMember key={friend.id} friend={friend} />)) }
        </div>
      </div>
    </div>
  )
}

export default NewChat