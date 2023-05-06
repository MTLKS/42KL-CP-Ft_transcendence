import React, { useContext } from 'react'
import PixelatedImage from '../../../components/PixelatedImage'
import ProfileSmall from './ProfileSmall';
import ProfileElo from './ProfileElo';
import ProfileStat from './ProfileStat';
import { UserData } from '../../../model/UserData';
import UserContext from '../../../context/UserContext';

interface ProfileBodyProps {
  pixelSize: number
  expanded: boolean;
  status: string;
}

function ProfileBody(props: ProfileBodyProps) {
  const { myProfile } = useContext(UserContext);
  const { pixelSize, expanded, status } = props;
  const { avatar, elo } = myProfile;
  return (
    <div className={` flex flex-row w-full box-border transition-all duration-300 ease-in-out ${!expanded ? "h-20" : "mb-1 mt-1"}`}>
      <div className={expanded ? 'flex-1 mr-1 bg-dimshadow transition-all' : 'w-20 h-20 aspect-square transition-all'}>
        <PixelatedImage src={avatar} pixelSize={pixelSize} className='w-full' />
      </div>
      <ProfileSmall expanded={!expanded} status={status} />
      <div className={expanded ? 'mr-1 bg-dimshadow flex-1 transition-all duration-1000 ease-in-out' : 'h-20 transition-all duration-1000 ease-in-out'}>
        <ProfileElo expanded={expanded} elo={elo} />
      </div>
      <ProfileStat expanded={expanded} />
    </div>
  )
}

export default ProfileBody