import React from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import FriendlistTag from './FriendlistTag'
import { FriendData } from '../../modal/FriendData'
import Highlighter from '../../components/Highlighter';

interface FriendInfoProps {
  friend: FriendData,
  intraName: string,
  searchTerm?: string,
}

function FriendInfo(props: FriendInfoProps) {

  const { friend, intraName, searchTerm } = props;
  let friendIntraName = (friend.receiverIntraName === intraName ? friend.senderIntraName : friend.receiverIntraName);

  return (
    <div className='flex flex-row text-highlight'>
      <div className='w-[16ch]'>
        <Highlighter text={friend.userName} searchTerm={searchTerm}/>
      </div>
      <FriendlistSeparator />
      <div className='w-[16ch]'>
        <Highlighter text={friendIntraName} searchTerm={searchTerm}/>
      </div>
      <FriendlistSeparator />
      <div className='w-[9ch]'>
        <Highlighter text={friend.elo.toString()} searchTerm={searchTerm}/>
      </div>
      <FriendlistSeparator />
      <div className={`w-[12ch]`}>
        <FriendlistTag type={friend.status} searchTerm={searchTerm}/>
      </div>
      {
        <>
          <div className={`${friend.status.toLowerCase() === "accepted" ? '' : 'invisible'}`}>
            <FriendlistSeparator/>
          </div>
          <div className={`w-[9ch] ${friend.status.toLowerCase() === "accepted" ? '' : 'invisible'}`}>
            <Highlighter text={"online"} searchTerm={searchTerm}/>
          </div>
        </>
      }
    </div>
  )
}

export default FriendInfo