import React, { useContext, useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';
import StatusIndicator from '../StatusIndicator';
import { UserData } from '../../../model/UserData';
import UserContext from '../../../contexts/UserContext';

interface ProfileSmallProps {
  expanded: boolean;
  status: string;
}

function ProfileSmall(props: ProfileSmallProps) {
  const { expanded, status } = props;
  const { myProfile } = useContext(UserContext);
  const { userName } = myProfile;
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
        <div className=' text-2xl text-dimshadow font-extrabold'>{userName}</div>
        <div className=' text-xs text-dimshadow'>THE BLACKHOLE DESTROYER</div>
      </div>
      <div className=' bg-dimshadow w-1 h-16 mr-5' />
      <div>
        <StatusIndicator status={status} />
      </div>
    </div>
  )

  async function animateWidth() {
    await sleep(10);
    setWidth("w-full h-20");
  }
}

export default ProfileSmall