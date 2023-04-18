import React, { useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';
import StatusIndicator from '../../StatusIndicator';

interface ProfileSmallProps {
  expanded: boolean;
}

function ProfileSmall(props: ProfileSmallProps) {
  const { expanded } = props;
  const [width, setWidth] = useState("w-0");

  useEffect(() => {
    if (expanded)
      setWidth("w-full h-20");
    else
      setWidth("w-0");
  }, [expanded]);


  return (
    <div className={`flex flex-row overflow-hidden items-center transition-all duration-500 ease-in-out ${width}`} >
      <div className='flex flex-col justify-center mx-5'>
        <div className=' text-2xl text-dimshadow font-extrabold'>JOHNDOE</div>
        <div className=' text-xs text-dimshadow'>THE BLACKHOLE DESTROYER</div>
      </div>
      <div className=' bg-dimshadow w-1 h-16 mr-5' />
      <div>
        <StatusIndicator status="offline" />
      </div>
    </div>
  )

  async function animateWidth() {
    await sleep(10);
    setWidth("w-full h-20");
  }
}

export default ProfileSmall