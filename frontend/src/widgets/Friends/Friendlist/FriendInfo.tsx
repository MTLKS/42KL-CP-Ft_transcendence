import React, { useState } from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import FriendlistTag from './FriendlistTag'
import { FriendData } from '../../../modal/FriendData'
import Highlighter from '../../../components/Highlighter';
import socketApi from '../../../api/socketApi';

interface FriendInfoProps {
  friend: FriendData,
  intraName: string,
  searchTerm?: string,
}

function FriendInfo(props: FriendInfoProps) {

  const [onlineStatus, setOnlineStatus] = useState("");
  const { friend, intraName, searchTerm } = props;
  let friendIntraName = (friend.receiverIntraName === intraName ? friend.senderIntraName : friend.receiverIntraName);
  let friendshipStatus = friend.status.toLowerCase();

  friendshipStatus = (friendshipStatus !== "pending"
    ? friendshipStatus
    : (friend.receiverIntraName === intraName ? "incoming" : "outgoing")
  )


  // Handle user's online/offline status
  // useEffect(() => {
  //   if (friend.status.toLowerCase() === "blocked")
  //     return;
  //   console.log(`Yo I want to check if ${friendIntraName} is online`);
  //   socketApi.sendMessages("statusRoom", {});
  //   socketApi.listen("statusRoom", (data: any) => {
  //     setOnlineStatus((data.status as string).toLowerCase());
  //     console.log(data);
  //   });

  //   return () => {
  //     console.log("Aight thanks mate. Thanks for letting me know.");
  //     socketApi.removeListener("statusRoom");
  //     socketApi.sendMessages("statusRoom", { intraName: friendIntraName, joining: false});
  //   }
  // })

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
        <Highlighter text={friend.elo.toString()} searchTerm={searchTerm} />
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

function useEffect(arg0: () => void) {
  throw new Error('Function not implemented.');
}
