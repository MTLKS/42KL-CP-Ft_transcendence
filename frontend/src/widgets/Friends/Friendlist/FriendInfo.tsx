import React, { useContext, useEffect, useState } from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import FriendlistTag from './FriendlistTag'
import { FriendData } from '../../../model/FriendData'
import Highlighter from '../../../components/Highlighter';
import UserContext from '../../../contexts/UserContext';
import SocketApi from '../../../api/socketApi';

interface FriendInfoProps {
  friend: FriendData,
  intraName: string,
  searchTerm?: string,
}

function FriendInfo(props: FriendInfoProps) {

  // const { defaultSocket } = useContext(UserContext);
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const { friend, intraName, searchTerm } = props;
  let friendIntraName = (friend.receiverIntraName === intraName ? friend.senderIntraName : friend.receiverIntraName);
  let friendshipStatus = friend.status.toLowerCase();

  friendshipStatus = (friendshipStatus !== "pending"
    ? friendshipStatus
    : (friend.receiverIntraName === intraName ? "incoming" : "outgoing")
  )

  useEffect(() => {
    if (friendshipStatus === "blocked")
      return;
    let friendInfoSocket = new SocketApi();
    console.log(friendIntraName);
    friendInfoSocket.sendMessages("statusRoom", { intraName: friendIntraName, joining: true });
    friendInfoSocket.listen("statusRoom", (data: any) => {
      if (data !== undefined && data.status !== undefined && data.intraName === friendIntraName)
        setOnlineStatus((data.status as string).toLowerCase());
    });

    return () => {
      // console.log("remove listener:", friendIntraName);
      friendInfoSocket.removeListener("statusRoom");
      friendInfoSocket.sendMessages("statusRoom", { intraName: friendIntraName, joining: false });
    }
  }, [friend]);

  return (
    <div className='flex flex-row text-highlight'>
      <div className='w-[16ch] normal-case'>
        <Highlighter text={friend.userName} searchTerm={searchTerm} />
      </div>
      <FriendlistSeparator />
      <div className='w-[16ch]'>
        <Highlighter text={friendIntraName} searchTerm={searchTerm} />
      </div>
      <FriendlistSeparator />
      <div className='w-[9ch]'>
        {
          friendshipStatus === "blocked"
            ? <span className='text-highlight bg-accRed whitespace-pre'> HIDDEN </span>
            : <Highlighter text={ friend.elo.toString()} searchTerm={searchTerm} />
        }
      </div>
      <FriendlistSeparator />
      <div className={`w-[12ch]`}>
        <FriendlistTag type={friendshipStatus} searchTerm={searchTerm} />
      </div>
      {
        <>
          <div className={`${friend.status.toLowerCase() === "blocked" ? 'invisible' : ''}`}>
            <FriendlistSeparator />
          </div>
          <div className={`w-[9ch] ${friend.status.toLowerCase() === "blocked" ? 'invisible' : ''}`}>
            <Highlighter text={onlineStatus.toLowerCase()} searchTerm={searchTerm} />
          </div>
        </>
      }
    </div>
  )
}

export default FriendInfo
