import React, { useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';

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
    <div className='flex flex-row w-full mb-1 box-border transition-all duration-500 ease-in-out'
      style={{ height: height }}
    >
      <div className='flex flex-col w-full justify-center  bg-dimshadow px-5 mr-1'>
        <div className=' text-2xl text-highlight font-extrabold'>JOHNDOE <a href='' className='hover:underline cursor-pointer'>(jdoe)</a></div>
        <div className=' text-xs text-highlight'>THE BLACKHOLE DESTROYER</div>
      </div>
      <div className=' bg-dimshadow w-20 aspect-square '>
        <div className=' bg-highlight w-10 h-10 m-auto' />
      </div>
    </div>
  )

  async function animateHeight() {
    await sleep(100);
    setHeight(maxHeight);
  }
}

export default ProfileHeader