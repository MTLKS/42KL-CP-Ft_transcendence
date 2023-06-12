import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FaTableTennis } from 'react-icons/fa'
import UserContext from '../../../contexts/UserContext';
import { gameData } from '../../../main';

function ChatGameInvite(props: { sender: string, senderIntraName: string }) {

  const { sender, senderIntraName } = props;
  const { myProfile } = useContext(UserContext);
  const isMyInvitation = useMemo(() => senderIntraName === myProfile.intraName, [senderIntraName, myProfile.intraName]);
  const [joinSuccessful, setJoinSuccessful] = useState(false);

  useEffect(() => {
    gameData.setJoinSuccessful = setJoinSuccessful;
  }, []);

  useEffect(() => {
    if (!joinSuccessful) return;
    console.log("join successful!");
    setJoinSuccessful(false);
  }, [joinSuccessful]);

  return (
    <button className={`w-[65%] h-fit bg-highlight flex flex-row ${isMyInvitation && 'cursor-default'} group items-center`} onClick={acceptGameInvite} disabled={isMyInvitation}>
      <div className='flex flex-col flex-1 p-4 gap-y-1 items-start'>
        <p className='text-sm font-semibold text-dimshadow'><span className='font-extrabold bg-accGreen text-highlight px-[1ch]'>{sender}</span> challenges you!</p>
        <p className='text-xs animate-pulse'>looking for player...</p> {/** in game, looking for player, expired */}
      </div>
      <div className='w-20 p-1 aspect-square bg-highlight'>
        <div className='flex flex-row items-center justify-center w-full h-full bg-dimshadow'>
          <FaTableTennis className='text-4xl text-highlight w-fit h-fit' />
        </div>
      </div>
    </button>
  )

  function acceptGameInvite() {
    if (senderIntraName === myProfile.intraName) return;
    gameData.joinInvite(sender);
  }
}

export default ChatGameInvite