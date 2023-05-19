import React, { useContext, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { FriendData } from '../../../model/FriendData';
import UserContext from '../../../contexts/UserContext';
import { NewChatContext } from '../../../contexts/ChatContext';

interface ChatMemberProps {
  friend: FriendData,
  toggleMember: (intraName: string) => boolean;
}

function ChatMember(props: ChatMemberProps) {

  const { friend, toggleMember } = props;
  const { members } = useContext(NewChatContext);
  const { myProfile } = useContext(UserContext);
  const [isSelected, setIsSelected] = useState(false);
  const friendInfo = friend.receiver.intraName !== myProfile.intraName ? friend.receiver : friend.sender;

  useEffect(() => {
    (members.includes(friendInfo.intraName)) ? setIsSelected(true) : setIsSelected(false);
  }, [members])

  const handleSelectUser = () => {
    const selected: boolean = toggleMember(friendInfo.intraName);
    setIsSelected(selected);
  }

  return (
    <div
      className='flex flex-row gap-x-5 group items-center cursor-pointer transition-all duration-75 ease-in-out'
      onClick={handleSelectUser}
    >
      <div className='aspect-square object-cover w-12 relative'>
        <img
          className='aspect-square object-cover w-full'
          src={friendInfo.avatar}
          alt={friendInfo.userName + ' avatar'}
        />
        <div className={`absolute w-full h-full bg-dimshadow/80 top-0 ${isSelected ? 'block' : 'hidden group-hover:block'} transition-all duration-150 ease-in-out p-3 group`}>
          <FaCheck className={`text-2xl text-highlight ${!isSelected && 'group-hover:invisible'}`} />
        </div>
      </div>
      <p className={`'text-base font-extrabold ${isSelected ? 'text-highlight' : 'text-highlight/50 group-hover:text-highlight'} transition-all duration-150 ease-in-out' whitespace-pre`}>{friendInfo.userName} ({friendInfo.intraName})</p>
    </div>
  )
}

export default ChatMember