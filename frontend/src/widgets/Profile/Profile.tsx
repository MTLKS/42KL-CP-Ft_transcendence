import React, { useEffect, useState } from 'react'
import sleep from '../../functions/sleep';
import ProfileHeader from './Expanded/ProfileHeader';
import ProfileBody from './Expanded/ProfileBody';
import RecentMatches from './RecentMatches/RecentMatches';
import { UserData } from '../../modal/UserData';

interface ProfileProps {
  userData: UserData;
  expanded?: boolean;
}
function Profile(props: ProfileProps) {
  const { userData } = props;
  const [pixelSize, setPixelSize] = useState(400);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (props.expanded) setExpanded(true);
    else setExpanded(false);
  }, [props.expanded]);

  useEffect(() => {
    pixelatedToSmooth();
  }, [userData.avatar]);

  return (<div className='w-full bg-highlight flex flex-col items-center box-border'
    onClick={onProfileClick}
  >
    <ProfileHeader expanded={expanded} userData={userData} />
    <ProfileBody expanded={expanded} pixelSize={pixelSize} userData={userData} />
    <RecentMatches expanded={expanded} />
  </div>);

  async function pixelatedToSmooth(start: number = 200) {
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
      await sleep(10);
    }
  }

  function onProfileClick() {
    setExpanded(!expanded);
    if (pixelSize > 1) return;
    pixelatedToSmooth();
  }

}

export default Profile