import React from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import FriendlistTag from './FriendlistTag'
import { TabWidth } from './FriendlistConfig'
import { FriendData } from '../../modal/FriendData'

interface FriendInfoProps {
  friend: FriendData,
  intraName: string, // logged user intraName
}

function FriendInfo(props: FriendInfoProps) {

  const { friend, intraName } = props;
  let friendIntraName = (friend.receiverIntraName === intraName ? friend.senderIntraName : friend.receiverIntraName);

  return (
    <div className='flex flex-row text-highlight'>
      <p className={`w-[16ch] truncate`}>{friend.userName}</p>
      <FriendlistSeparator />
      <p className={`w-[16ch] truncate`}>{friendIntraName}</p>
      <FriendlistSeparator />
      <p className={`w-[9ch]`}>{friend.elo}</p>
      <FriendlistSeparator />
      <p className={`w-[12ch]`}>
        <FriendlistTag type={friend.status}/>
      </p>
      {
        friend.status.toLowerCase() === "accepted" ?
        <>
          <FriendlistSeparator />
          <p className={`w-[9ch]`}>online</p>
        </>
        : <></>
      }
    </div>
  )
}

export default FriendInfo