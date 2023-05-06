import React from 'react';
import { FriendData } from "../../../modal/FriendData";

function FriendActionProfileCard(props: {isCurrentIndex: boolean, friend: FriendData, friendIntraName: string}) {

  const { isCurrentIndex, friend, friendIntraName } = props;

  return (
    <div
      className={`flex flex-row ${isCurrentIndex ? 'group cursor-pointer' : ''} group-hover:bg-highlight items-center h-12 w-fit select-none`}
      onClick={() => console.log(`Check this person's profile`)}
    >
      <img
        className="aspect-square h-full object-cover"
        src={friend.avatar}
        alt=""
      />
      <div className='group-hover:bg-highlight h-full p-3.5'>
        <p className='text-highlight group-hover:text-dimshadow font-extrabold text-base w-full h-full select-none'>{friend.userName} ({friendIntraName})</p>
      </div>
    </div>
  )
}

export default FriendActionProfileCard;
