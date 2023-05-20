import React, { useContext, useEffect, useState } from 'react'
import { FaCheck, FaPlus } from 'react-icons/fa'
import { FriendData } from '../../../../model/FriendData';
import UserContext from '../../../../contexts/UserContext';
import { UserData } from '../../../../model/UserData';

interface ChatMemberProps {
  isSelected?: boolean;
  selectable: boolean;
  userData: UserData,
  memberRole?: 'owner' | 'admin' | 'member';
  toggleMember: (userInfo: UserData) => boolean;
}

function ChatMemberRoleTag(props: { role: 'owner' | 'admin' | 'member' }) {
  const { role } = props;

  if (role === 'admin') {
    return (
      <div
        className='bg-dimshadow text-highlight hover:text-dimshadow hover:bg-highlight hover:border-0 border-2 border-dashed text-base font-extrabold uppercase p-2 cursor-pointer flex flex-row items-center gap-x-2'
        onMouseDown={(e) => { e.preventDefault() }}
        onMouseUp={(e) => { e.preventDefault() }}
      >
        <FaPlus className='text-base'/>
        <p>{role}</p>
      </div>
    )
  }

  if (role === 'owner') {
    return (
      <div className='bg-highlight text-base font-extrabold uppercase p-2'>
        <p>{role}</p>
      </div>
    )
  }
  return <></>
}

function ChatMember(props: ChatMemberProps) {

  const { selectable, userData, toggleMember, memberRole } = props;
  const { myProfile } = useContext(UserContext);
  const [isSelected, setIsSelected] = useState(props.isSelected || false);

  const handleSelectUser = () => {
    if (!selectable) return;
    const selected: boolean = toggleMember(userData);
    setIsSelected(selected);
  }

  return (
    <div
      className='flex flex-row w-full items-center transition-all duration-75 ease-in-out justify-between'
      onClick={handleSelectUser}
    >
      <div className={`flex flex-row flex-1 items-center gap-x-4 ${selectable ? 'group cursor-pointer' : 'cursor-default'}`}>
        <div className='aspect-square object-cover w-12 relative'>
          <img
            className='aspect-square object-cover w-full'
            src={userData.avatar}
            alt={userData.userName + ' avatar'}
          />
          <div className={`absolute w-full h-full bg-dimshadow/80 top-0 ${isSelected ? 'block' : 'hidden group-hover:block'} transition-all duration-150 ease-in-out p-3 group`}>
            <FaCheck className={`text-2xl text-highlight ${!isSelected && 'group-hover:invisible'}`} />
          </div>
        </div>
        <p className={`'text-base font-extrabold ${isSelected ? 'text-highlight' : 'text-highlight/50 group-hover:text-highlight'} transition-all duration-150 ease-in-out' whitespace-pre`}>{userData.userName} ({userData.intraName})</p>
      </div>
      { memberRole !== undefined && <ChatMemberRoleTag role={memberRole} /> }
    </div>
  )
}

export default ChatMember