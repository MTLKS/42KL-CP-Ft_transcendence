import React, { useContext, useEffect, useState } from 'react'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatMember from '../Chatroom/ChatMember'
import { UserData } from '../../../../model/UserData'
import { NewChannelContext } from '../../../../contexts/ChatContext'
import { FaUserPlus } from 'react-icons/fa'

interface ChannelMemberListProps {
  isScrollable?: boolean,
  modifying?: boolean,
  viewingInviteList?: boolean,
  title: string,
  friendList?: UserData[],
}

function ChannelMemberList(props: ChannelMemberListProps) {

  const { state, dispatch } = useContext(NewChannelContext);
  const { isScrollable = true, modifying, title, friendList, viewingInviteList = false } = props;
  const [filterKeyword, setFilterKeyword] = useState("");

  return (
    <div className={`w-[95%] ${isScrollable && 'h-full'} mx-auto flex flex-col gap-y-2`}>
      <div className='flex flex-col gap-y-2 sticky top-0 z-10 bg-dimshadow'>
        <ChatTableTitle title={`${title} (${friendList === undefined ? state.members.length : friendList.length})`} searchable={true} setFilterKeyword={setFilterKeyword} />
        {(state.isOwner || state.isAdmin) && !viewingInviteList && !state.isNewChannel && <button className='flex flex-row items-center justify-center gap-x-1 uppercase w-full h-fit border-2 border-accCyan border-dashed text-xs p-2 font-extrabold bg-dimshadow hover:bg-accCyan text-accCyan hover:text-highlight transition-all duration-150' onClick={() => dispatch({ type: 'TOGGLE_IS_INVITING', isInviting: true})}><FaUserPlus /> INVITE FRIENDS</button>}
      </div>
      <div className='w-full h-full overflow-y-scroll flex flex-col gap-y-2.5 scrollbar-hide scroll-smooth'>
        {displayMemberList()}
      </div>
    </div>
  )

  function displayMemberList() {

    if (friendList !== undefined) {
      if (state.isInviting) {
        return (friendList.map(friend => <ChatMember key={friend.intraId} selectable={true} userData={friend} />));
      }
      return (friendList.map(friend => <ChatMember key={friend.intraId} selectable={true} userData={friend} isSelected={state.members.find(member => member.memberInfo.intraName === friend.intraName) !== undefined}/>));
    }
    if (!state.isNewChannel) {
      const owner = state.members.find(member => member.role === "owner"); // only one owner, so it's fine
      const admins = state.members.filter(member => member.role === "admin");
      const members = state.members.filter(member => member.role === "member");
      const memberList = [];
      if (owner !== undefined) {
        memberList.push(owner);
      }
      memberList.push(...admins);
      memberList.push(...members);
      return (memberList.map(member => <ChatMember key={member.memberInfo.intraId} selectable={false} userData={member.memberInfo} memberRole={member.role} isModifyingMember={modifying} />));
    }
    return (state.members.map(member => <ChatMember key={member.memberInfo.intraId} selectable={false} userData={member.memberInfo} memberRole={member.role} isModifyingMember={modifying} />));
  }
}

export default ChannelMemberList