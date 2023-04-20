import React from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import FriendlistTag from './FriendlistTag'
import { TabWidth } from './FriendlistConfig'
import { FriendData } from '../../modal/FriendData'

function FriendInfo(props: FriendData) {

  const { senderName, receiverName, receiverIntraName, eloScore, status = "online"} = props;

  return (
    <div className='flex flex-row text-highlight'>
      <p className={`w-[${TabWidth.nickname}ch] truncate`}>{receiverName}</p>
      <FriendlistSeparator />
      <p className={`w-[${TabWidth.intraName}ch] truncate`}>{receiverIntraName}</p>
      <FriendlistSeparator />
      <p className={`w-[${TabWidth.eloScore}ch]`}>{eloScore}</p>
      <FriendlistSeparator />
      <p className={`w-[${TabWidth.relationship}ch]`}>
        <FriendlistTag type={status}/>
      </p>
      <FriendlistSeparator />
      <p className={`w-[${TabWidth.status}]`}>online</p>
    </div>
  )
}

export default FriendInfo