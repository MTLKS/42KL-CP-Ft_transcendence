import React, { useState } from 'react'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatMember from '../Chatroom/ChatMember'
import { NewChannelAction, NewChannelState } from './newChannelReducer'
import { FriendData } from '../../../../model/FriendData'
import { UserData } from '../../../../model/UserData'

interface ChannelMemberListProps {
  title: string,
  state: NewChannelState,
  dispatch: React.Dispatch<NewChannelAction>,
  friendList?: UserData[],
}

function ChannelMemberList(props: ChannelMemberListProps) {

  const { title, state, dispatch, friendList } = props;
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
      return (friendList.map(friend => <ChatMember selectable={true} userData={friend} toggleMember={handleToggleMember}/>));
    }
    return (state.members.map(member => <ChatMember selectable={false} userData={member.memberInfo} toggleMember={handleToggleMember} memberRole={member.role} />));
  }

  function handleToggleMember(userData: UserData): boolean {
    if (state.members.find(member => member.memberInfo.intraName === userData.intraName)) {
      dispatch({ type: 'DESELECT_MEMBER', userInfo: userData });
      return false;
    } else {
      dispatch({ type: 'SELECT_MEMBER', userInfo: userData });
      return true;
    }
  }
}

export default ChannelMemberList