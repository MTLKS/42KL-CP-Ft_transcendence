import React, { useContext, useEffect, useState } from 'react'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatMember from '../Chatroom/ChatMember'
import { NewChannelAction, NewChannelState } from './newChannelReducer'
import { FriendData } from '../../../../model/FriendData'
import { UserData } from '../../../../model/UserData'
import { NewChannelContext } from '../../../../contexts/ChatContext'

interface ChannelMemberListProps {
  title: string,
  friendList?: UserData[],
}

function ChannelMemberList(props: ChannelMemberListProps) {

  const { state } = useContext(NewChannelContext);
  const { title, friendList } = props;
  const [filterKeyword, setFilterKeyword] = useState("");

  return (
    <div className='w-[95%] h-full mx-auto flex flex-col gap-y-2'>
      <ChatTableTitle title={`${title} (${friendList === undefined ? state.members.length : friendList.length})`} searchable={true} setFilterKeyword={setFilterKeyword} />
      <div className='w-full h-full overflow-y-scroll flex flex-col gap-y-2.5 scrollbar-hide scroll-smooth'>
        {displayMemberList()}
      </div>
    </div>
  )

  function displayMemberList() {
    if (friendList !== undefined) {
      return (friendList.map(friend => <ChatMember key={friend.intraId} selectable={true} userData={friend} isSelected={state.members.find(member => member.memberInfo.intraName === friend.intraName) !== undefined}/>));
    }
    return (state.members.map(member => <ChatMember key={member.memberInfo.intraId} selectable={false} userData={member.memberInfo} memberRole={member.role} />));
  }
}

export default ChannelMemberList