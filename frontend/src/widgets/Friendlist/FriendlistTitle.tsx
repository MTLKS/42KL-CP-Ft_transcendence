import React from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import { TabWidth } from './FriendlistConfig'

function FriendlistTitle() {
  return (
    <div className='flex flex-row text-highlight'>
      <p className={`w-[${TabWidth.nickname}ch]`}>nickname</p>
      <FriendlistSeparator />
      <p className={`w-[${TabWidth.intraName}ch]`}>intra name</p>
      <FriendlistSeparator />
      <p className=''>elo score</p>
      <FriendlistSeparator />
      <p className=''>relationship</p>
      <FriendlistSeparator />
      <p className={`w-[${TabWidth.status}ch]`}>status</p>
    </div>
  )
}

export default FriendlistTitle