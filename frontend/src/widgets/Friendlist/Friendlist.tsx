import React from 'react'
import FriendlistTitle from './FriendlistTitle'
import { FriendTags } from '../../modal/FriendData'
import FriendlistTag from './FriendlistTag'
import FriendInfo from './FriendInfo';

const friend = {
  senderName: "johnny doe",
  receiverName: "ping pong king",
  receiverIntraName: "ppk",
  eloScore: 420,
  status: "friend",
  avatar: "https://refactoring.guru/images/patterns/languages/typescript-2x.png",
}

function Friendlist() {

  const friends = [];
  const muted = [];
  const pending = [];
  const blocked = [];

  return (
    <div className='w-full h-full flex flex-col overflow-hidden text-base uppercase bg-dimshadow p-[2ch] gap-y-[1.5rem]'>
      <FriendlistTitle />
      <div className='flex flex-col gap-y-[1.5rem]'>
        <FriendlistTag type={`${FriendTags.friend}`} />
        <div>
          <FriendInfo {...friend} />
          <FriendInfo {...friend} />
          <FriendInfo {...friend} />
          <FriendInfo {...friend} />
        </div>
      </div>
      <FriendlistTag type={`${FriendTags.blocked}`} />
      <FriendlistTag type={`${FriendTags.muted}`} />
      <FriendlistTag type={`${FriendTags.pending}`} />
    </div>
  )
}

export default Friendlist