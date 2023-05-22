import React, { useContext, useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';
import StatusIndicator from '../StatusIndicator';
import { UserData } from '../../../model/UserData';
import UserContext from '../../../contexts/UserContext';
import PreviewProfileContext from '../../../contexts/PreviewProfileContext';

interface ProfileHeaderProps {
  expanded: boolean;
  status: string;
  onProfileClick: () => void;
}

function ProfileHeader(props: ProfileHeaderProps) {
  const { currentPreviewProfile: myProfile } = useContext(PreviewProfileContext);
  const { expanded, status, onProfileClick } = props;
  const { userName, intraName, elo } = myProfile;
  const maxHeight = 80;
  const [height, setHeight] = useState(0);

  const titles: { [key: string]: string } = {
    '0': 'DISAPPOINTMENT',
    '100': 'UH OH',
    '200': 'PADDLE MADE IN CHINA',
    '300': 'IT WAS THE LAG',
    '400': 'BEGINNER PADDLE',
    '500': 'BALL SCRATCHER',
    '600': 'PADDLE WIZARD',
    '700': 'SIR BOUNCE-A-LOT',
    '800': 'PING PONG CONNOISSEUR',
    '900': 'THE SPINNER',
    '1000': 'SUPREME PADDLE WARRIOR',
    '1100': 'GRANDMASTER OF THE TABLE',
    '1200': 'LEGENDARY BALLER',
    '1300': 'PADDLE HACKER',
    '1400': 'PING CHILLING',
    '1500': 'BASH GURU',
    '1600': 'SULTAN OF SWAT',
    '1700': 'NO PING SPIKE',
    '1800': 'AGROSTOPHOBIA',
    '1900': 'PONG GOD',
    '2000': 'PONG KHONVOUM',
  };

  useEffect(() => {
    if (height == 0 && expanded)
      animateHeight();
    if (height == maxHeight && !expanded)
      setHeight(0);
  }, [expanded]);

  const getEloTitle = () => {
    let currentTitle = 'HOW IS THIS POSSIBLE'; 

    for (const range in titles) {
      if (elo >= parseInt(range)) {
        currentTitle = titles[range];
      } else {
        break;
      }
    }

    return currentTitle;
  };

  return (
    <div className='flex flex-row justify-between overflow-hidden w-full box-border transition-all duration-500 ease-in-out bg-dimshadow  cursor-pointer'
      style={{ height: height }}
      onClick={onProfileClick}
    >
      <div className='flex flex-col flex-1 justify-center bg-dimshadow px-5'>
        <div className=' text-2xl text-highlight font-extrabold'>{userName} <a href={`https://profile.intra.42.fr/users/${intraName}`} className='hover:underline cursor-pointer' target='_blank'>({intraName})</a></div>
        <div className=' text-xs text-highlight'>{getEloTitle()}</div>
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