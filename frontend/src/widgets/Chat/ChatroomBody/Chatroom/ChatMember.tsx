import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaCheck, FaMinus, FaPlus } from 'react-icons/fa'
import { FriendData } from '../../../../model/FriendData';
import UserContext from '../../../../contexts/UserContext';
import { UserData } from '../../../../model/UserData';
import { NewChannelContext } from '../../../../contexts/ChatContext';

interface ChatMemberProps {
  isSelected?: boolean;
  selectable: boolean;
  userData: UserData,
  memberRole?: 'owner' | 'admin' | 'member';
}

interface ChatMemberRoleTagProps {
  role: 'owner' | 'admin' | 'member';
  intraName: string;
}

function ChatMemberRoleTag(props: ChatMemberRoleTagProps) {

  const { state, dispatch } = useContext(NewChannelContext);
  const { role, intraName } = props;
  const [isPressed, setIsPressed] = useState(false);

  if (role === 'member') {
    return (
      <div className='flex flex-row overflow-hidden'>
        <button
          className={`w-[100%] overflow-hidden bg-dimshadow text-highlight border-highlight border-2 border-dashed text-base font-extrabold uppercase p-2 cursor-pointer flex flex-row items-center gap-x-2`}
          onClick={promoteOrDemoteAsAdmin}
        >
          {isPressed ? <FaMinus className='text-base'/> : <FaPlus className='text-base'/>}
          <p>admin</p>
        </button>
      </div>
    )
  }

  if (role === 'admin') {
    return (
      <div className='flex flex-row overflow-hidden'>
        <button
          className={`w-[100%] overflow-hidden ${isPressed ? 'bg-highlight text-dimshadow' : 'bg-dimshadow text-highlight'} border-highlight border-2 border-dashed text-base font-extrabold uppercase p-2 cursor-pointer flex flex-row items-center gap-x-2`}
          onClick={promoteOrDemoteAsAdmin}
        >
          {isPressed ? <FaMinus className='text-base'/> : <FaPlus className='text-base'/>}
          <p>admin</p>
        </button>
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

  return null;

  function promoteOrDemoteAsAdmin() {
    setIsPressed(!isPressed);
    if (isPressed) {
      dispatch({ type: 'ASSIGN_AS_MEMBER', intraName: intraName });
    } else {
      dispatch({ type: 'ASSIGN_AS_ADMIN', intraName: intraName });
    }
  }
}

function ChatMember(props: ChatMemberProps) {

  const { selectable, userData, memberRole } = props;
  const { dispatch } = useContext(NewChannelContext);
  const [isSelected, setIsSelected] = useState(props.isSelected || false);

  return (
    <div
      className='flex flex-row w-full items-center transition-all duration-75 ease-in-out justify-between'
      onClick={handleSelectMember}
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
      { memberRole !== undefined && <ChatMemberRoleTag intraName={userData.intraName} role={memberRole} /> }
    </div>
  )

  function handleSelectMember() {
    if (!selectable) return;
    if (isSelected)
      dispatch({ type: 'DESELECT_MEMBER', userInfo: userData });
    else
      dispatch({ type: 'SELECT_MEMBER', userInfo: userData });
    setIsSelected(!isSelected);
  }
}

export default ChatMember