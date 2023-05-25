import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaCheck, FaDoorOpen, FaMinus, FaPlus, FaSkull, FaVolumeMute, FaWalking } from 'react-icons/fa'
import { FriendData } from '../../../../model/FriendData';
import UserContext from '../../../../contexts/UserContext';
import { UserData } from '../../../../model/UserData';
import { NewChannelContext } from '../../../../contexts/ChatContext';

interface ChatMemberProps {
  isModifyingMember?: boolean;
  isSelected?: boolean;
  selectable: boolean;
  userData: UserData,
  memberRole?: 'owner' | 'admin' | 'member';
}

interface ChatMemberRoleTagProps {
  isModifying?: boolean;
  role: 'owner' | 'admin' | 'member';
  intraName: string;
}

function ChatMemberActions() {
  return (
    <div className='flex flex-row uppercase gap-1 items-center'>
      <ActionButton action='mute' />
      <ActionButton action='kick' />
      <ActionButton action='ban' />
    </div>
  )

  function ActionButton(props: { action: string}) {

    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        className={`flex flex-row cursor-default] z-[5] overflow-hidden bg-highlight text-dimshadow border-highlight border-2 border-dashed text-sm uppercase p-2 items-center gap-x-1 transition-all duration-100`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {getActionIcon(props.action)}
        {isHovered && <span className='h-full text-[10px] font-light transition-all duration-75'>{props.action}</span>}
      </button>
    )
  }

  function getActionIcon(action: string) {
    switch (action) {
      case 'mute':
        return <FaVolumeMute />
      case 'kick':
        return <FaDoorOpen />
      case 'ban':
        return <FaSkull />
      default:
        return null;
    }
  }
}

function ChatMemberRoleTag(props: ChatMemberRoleTagProps) {

  const { state, dispatch } = useContext(NewChannelContext);
  const { isModifying, role, intraName } = props;
  const [isPressed, setIsPressed] = useState(false);
  const currentTimeRef = useRef<number>(0);
  const [gradientPosition, setGradientPosition] = useState(0);

  if (role === 'member') {

    if (state.isNewChannel || (!state.isNewChannel && isModifying)) {
      return (
        <div className='flex flex-row relative'>
          <div
            className={`absolute z-0 top-0 left-0 h-full transition-all ease-linear ${gradientPosition === 0 ? 'duration-150' : 'duration-1000'} bg-highlight`}
            style={{ width: `${gradientPosition}%` }}
          ></div>
          <button
            key={intraName + "-member"}
            className={`mix-blend-difference w-[100%] z-[5] text-highlight overflow-hidden border-highlight border-2 border-dashed text-sm uppercase p-2 cursor-pointer flex flex-row items-center gap-x-2 transition-all duration-[3s]`}
            onMouseDown={confirmAction}
            onMouseUp={promoteMember}
          >
            {isPressed ? <FaMinus className='text-base' /> : <FaPlus className='text-base' />}
            <p>admin</p>
          </button>
        </div>
      )
    } else {
      return null;
    }
  }

  if (role === 'admin') {

    if (state.isNewChannel || (!state.isNewChannel && isModifying)) {
      return (
        <div className='flex flex-row overflow-hidden relative'>
          <div
            className='absolute z-0 top-0 left-0 h-full transition-all ease-linear duration-[1s] bg-highlight'
            style={{ width: `${gradientPosition}%` }}
          ></div>
          <button
            key={intraName + "-admin"}
            className={`w-[100%] z-[5] overflow-hidden bg-highlight text-dimshadow border-highlight border-2 border-dashed text-sm uppercase p-2 cursor-pointer flex flex-row items-center gap-x-2 transition-all duration-100`}
            onClick={demoteMember}
          >
            <FaMinus className='text-base' />
            <p>admin</p>
          </button>
        </div>
      )
    } else {
      return (
        <div className='flex flex-row'>
          <button key={intraName + "-admin"} className={`cursor-default w-[100%] z-[5] overflow-hidden bg-highlight text-dimshadow border-highlight border-2 border-dashed text-sm uppercase p-2 flex flex-row items-center gap-x-2 transition-all duration-100`}>
            <p>admin</p>
          </button>
        </div>
      )
    }
  }

  if (role === 'owner') {
    return (
      <div className='bg-accCyan text-highlight text-sm uppercase p-2'>
        <p>{role}</p>
      </div>
    )
  }

  return null;

  function confirmAction() {
    setGradientPosition(100);
    currentTimeRef.current = Date.now();
  }

  function promoteMember() {
    const currentTime = Date.now();
    const timeDifference = currentTime - currentTimeRef.current;

    if (timeDifference < 1000) {
      setGradientPosition(0);
      return;
    }
    if (timeDifference >= 1000) {
      dispatch({ type: 'ASSIGN_AS_ADMIN', intraName: intraName });
    }
    currentTimeRef.current = currentTime;
  }

  function demoteMember() {
    setGradientPosition(0);
    dispatch({ type: 'ASSIGN_AS_MEMBER', intraName: intraName });
  }
}

function ChatMember(props: ChatMemberProps) {

  const { isModifyingMember, selectable, userData, memberRole } = props;
  const { state, dispatch } = useContext(NewChannelContext);
  const [isSelected, setIsSelected] = useState(props.isSelected || false);

  return (
    <div
      className='flex flex-row w-full items-center transition-all duration-75 ease-in-out justify-between'
      onClick={handleSelectMember}
    >
      <div className={`flex flex-row flex-1 items-center gap-x-4 ${selectable ? 'group cursor-pointer' : 'cursor-default'}`}>
        <div className='aspect-square object-cover w-10 relative'>
          <img
            className='aspect-square object-cover w-full'
            src={userData.avatar}
            alt={userData.userName + ' avatar'}
          />
          <div className={`absolute w-full h-full bg-dimshadow/80 top-0 ${isSelected ? 'block' : 'hidden group-hover:block'} transition-all duration-150 ease-in-out p-3 group`}>
            <FaCheck className={`text-lg text-highlight ${!isSelected && 'group-hover:invisible'}`} />
          </div>
        </div>
        <p className={`text-sm font-bold ${isSelected ? 'text-highlight' : 'text-highlight/50 group-hover:text-highlight'} transition-all duration-150 ease-in-out' whitespace-pre`}>{userData.userName} ({userData.intraName})</p>
      </div>
      <div className={`flex flex-row items-center ${isModifyingMember ? 'w-[35%] justify-between' : ''}`}>
        <div>
          {memberRole !== "owner" && isModifyingMember && <ChatMemberActions />}
        </div>
        {memberRole !== undefined && <ChatMemberRoleTag isModifying={isModifyingMember} intraName={userData.intraName} role={memberRole} />}
      </div>
    </div>
  )

  function handleSelectMember() {
    if (!selectable) return;

    setIsSelected(!isSelected);
    // to handle invite member to existing channel
    if (state.isInviting) {
      if (isSelected)
        dispatch({ type: 'REMOVE_INVITE', userInfo: userData});
      else
        dispatch({ type: 'INVITE_MEMBER', userInfo: userData });
      return ;
    }
    // to handle add member to new channel
    if (isSelected)
      dispatch({ type: 'DESELECT_MEMBER', userInfo: userData });
    else
      dispatch({ type: 'SELECT_MEMBER', userInfo: userData });
  }
}

export default ChatMember