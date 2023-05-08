import { FriendData } from "../../../model/FriendData";
import Profile from '../../Profile/Profile';
import { useState } from 'react';
import React from 'react';

function replaceProfile(friend: FriendData) {
  const [currentPreviewProfile, setCurrentPreviewProfile] = React.useState<FriendData | null>(null);
  const [topWidget, setTopWidget] = useState(<Profile />);

  setCurrentPreviewProfile(friend)
  setTopWidget(<Profile />)
}

function FriendActionProfileCard(props: { isCurrentIndex: boolean, friend: FriendData, friendIntraName: string }) {
  
  const { isCurrentIndex, friend, friendIntraName } = props;

  return (
    <div
      className={`flex flex-row ${isCurrentIndex ? 'group cursor-pointer' : ''} group-hover:bg-highlight items-center h-12 w-fit select-none`}
      onClick={() => replaceProfile(friend)
    }
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
