import React, { useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';
import StatusIndicator from '../../StatusIndicator';

interface ProfileHeaderProps {
  expanded: boolean;
}

function ProfileHeader(props: ProfileHeaderProps) {
  const { expanded } = props;
  const maxHeight = 80;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (height == 0 && expanded)
      animateHeight();
    if (height == maxHeight && !expanded)
      setHeight(0);
  }, [expanded]);

  return (
    <div className='flex flex-row justify-between overflow-hidden w-full mb-1 box-border transition-all duration-500 ease-in-out bg-dimshadow'
      style={{ height: height }}
    >
      <div className='flex flex-col flex-1 justify-center bg-dimshadow px-5'>
        <div className=' text-2xl text-highlight font-extrabold'>JOHNDOE <a href='' className='hover:underline cursor-pointer'>(jdoe)</a></div>
        <div className=' text-xs text-highlight'>THE BLACKHOLE DESTROYER</div>
      </div>
      <div className='flex flex-row w-[30%] items-center bg-dimshadow p-8'>
        <StatusIndicator status="in-game" />
      </div>
    </div>
  )

  async function animateHeight() {
    await sleep(100);
    setHeight(maxHeight);
  }
}

export default ProfileHeader