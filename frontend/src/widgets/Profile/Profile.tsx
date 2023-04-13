import React, { useEffect, useState } from 'react'
import Triangle from '../../components/Triangle'
import PixelatedImage from '../../components/PixelatedImage'
import sleep from '../../functions/sleep';
import ProfileHeader from './Expanded/ProfileHeader';
import ProfileBody from './Expanded/ProfileBody';
import RecentMatches from './Expanded/RecentMatches';


function Profile() {
  const [pixelSize, setPixelSize] = useState(400);
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
    if (pixelSize == 400)
      pixelatedToSmooth();
  }, []);

  return (<div className='w-full bg-highlight flex flex-col items-center box-border'
    onClick={onProfileClick}
  >
    <ProfileHeader expanded={expanded} />
    <ProfileBody expanded={expanded} pixelSize={pixelSize} />
    <RecentMatches expanded={expanded} />
  </div>);

  async function pixelatedToSmooth(start: number = 300) {
    let tmp = start;
    // style 1 jaggled animation
    // while (tmp > 1) {
    //   tmp = Math.floor(tmp / 1.2 - 1);
    //   if (tmp < 1) tmp = 1;
    //   setPixelSize(tmp);
    //   await sleep(80);
    // }
    // style 2 smooth animation
    while (tmp > 1) {
      tmp = Math.floor(tmp / 1.05);
      if (tmp < 1) tmp = 1;
      setPixelSize(tmp);
      await sleep(30);
    }
  }

  function onProfileClick() {
    setExpanded(!expanded);
    if (pixelSize > 1) return;
    // pixelatedToSmooth();
  }

}

export default Profile