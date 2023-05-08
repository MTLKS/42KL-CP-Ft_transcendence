import React from 'react'
import { FriendData } from '../../../model/FriendData'
import FriendlistTag from './FriendlistTag';
import FriendInfo from './FriendInfo';

interface FriendlistCategoryProps {
  intraName: string;
  friendlist: FriendData[];
  type: string;
}

function FriendlistCategory(props: FriendlistCategoryProps) {

  const { intraName, friendlist, type } = props;

  if (friendlist.length === 0) return <></>;

  const friends = friendlist.map((friend, index) => <FriendInfo key={index} friend={friend} intraName={intraName} />)

  // iterate through filtered friendlist, create component for each
  return (
    <div className='flex flex-col gap-y-[1.5rem]'>
      <FriendlistTag type={type} />
      <div>
        {friends}
      </div>
    </div>
  )
}

export default FriendlistCategory