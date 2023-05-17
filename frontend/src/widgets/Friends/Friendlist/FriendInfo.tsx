import React, { useContext, useEffect, useState } from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import FriendlistTag from './FriendlistTag'
import { FriendData } from '../../../model/FriendData'
import Highlighter from '../../../components/Highlighter';
import UserContext from '../../../contexts/UserContext';
import SocketApi from '../../../api/socketApi';
import PreviewProfileContext from '../../../contexts/PreviewProfileContext';
import { getProfileOfUser } from '../../../functions/profile';
import { UserData } from '../../../model/UserData';
import Profile from '../../Profile/Profile';

interface FriendInfoProps {
  friend: FriendData,
  intraName: string,
  searchTerm?: string,
}

function FriendInfo(props: FriendInfoProps) {

  const [onlineStatus, setOnlineStatus] = useState("offline");
  const { setPreviewProfileFunction, setTopWidgetFunction } = useContext(PreviewProfileContext);
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
    friendInfoSocket.sendMessages("statusRoom", { intraName: friendIntraName, joining: true });
    friendInfoSocket.listen("statusRoom", (data: any) => {
      if (data !== undefined && data.status !== undefined && data.intraName === friendIntraName)
        setOnlineStatus((data.status as string).toLowerCase());
    });

    return () => {
      friendInfoSocket.removeListener("statusRoom");
      friendInfoSocket.sendMessages("statusRoom", { intraName: friendIntraName, joining: false });
    }
  }, [friend]);

  return (
    <div className='flex flex-row text-highlight hover:cursor-pointer group hover:bg-highlight hover:text-dimshadow w-fit' onClick={viewFriendProfile}>
      <div className='group-hover:underline w-[16ch] normal-case'>
        <Highlighter text={friend.userName} searchTerm={searchTerm} />
      </div>
      <FriendlistSeparator />
      <div className='w-[16ch] group-hover:underline'>
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

  async function viewFriendProfile() {
    let friendData = await getProfileOfUser(friendIntraName);
    setPreviewProfileFunction(friendData.data as UserData);
    setTopWidgetFunction(<Profile expanded={true} />)
  }
}

export default FriendInfo
