import React from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import { TabWidth } from './FriendlistConfig'

function FriendlistTitle() {

  return (
    <div className='flex flex-row text-highlight'>
      <div className={`w-[${TabWidth.nickname}ch]`}>
        nickname
        {/* <Highlighter key="nickname" text={"nickname"} searchTerm={searchTerm}/> */}
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.intraName}ch]`}>
        intra name
        {/* <Highlighter key="intraname" text={"intra name"} searchTerm={searchTerm}/> */}
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.eloScore}ch] flex flex-row`}>
        elo
        {/* <Highlighter key="elo" text={"elo"} searchTerm={searchTerm}/> */}
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.relationship}ch]`}>
        relationship
        {/* <Highlighter key="relationship" text={"relationship"} searchTerm={searchTerm}/> */}
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.status}ch]`}>
        status
        {/* <Highlighter key="status" text={"status"} searchTerm={searchTerm}/> */}
      </div>
    </div>
  )
}

export default FriendlistTitle