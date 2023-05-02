import React, { useContext, useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';
import StatusIndicator from '../StatusIndicator';
import { UserData } from '../../../modal/UserData';
import UserContext from '../../../context/UserContext';

interface ProfileHeaderProps {
  expanded: boolean;
  status: string;
}

function ProfileHeader(props: ProfileHeaderProps) {
  const { myProfile } = useContext(UserContext);
  const { expanded, status } = props;
  const { userName, intraName } = myProfile;
  const maxHeight = 80;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (height == 0 && expanded)
      animateHeight();
    if (height == maxHeight && !expanded)
      setHeight(0);
  }, [expanded]);

  return (
    <div className='flex flex-row justify-between overflow-hidden w-full box-border transition-all duration-500 ease-in-out bg-dimshadow'
      style={{ height: height }}
    >
      <div className='flex flex-col flex-1 justify-center bg-dimshadow px-5'>
        <div className=' text-2xl text-highlight font-extrabold'>{userName} <a href={`https://profile.intra.42.fr/users/${intraName}`} className='hover:underline cursor-pointer' target='_blank'>({intraName})</a></div>
        <div className=' text-xs text-highlight'>THE BLACKHOLE DESTROYER</div>
      </div>
      <div className='flex flex-row w-fit items-center bg-dimshadow p-8'>
        <StatusIndicator status={status} invert={true} />
      </div>
    </div>
  )

  async function animateHeight() {
    await sleep(100);
    setHeight(maxHeight);
  }
}

export default ProfileHeader