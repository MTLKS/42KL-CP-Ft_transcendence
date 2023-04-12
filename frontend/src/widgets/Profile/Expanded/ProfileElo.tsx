import React from 'react'
import Triangle from '../../../components/Triangle';

interface ProfileEloProps {
  expanded: boolean;
  elo?: number;
  winning?: boolean;
}
function ProfileElo(props: ProfileEloProps) {
  const { expanded, elo = 420, winning = true } = props;

  return (
    <div className={expanded ? 'relative w-full h-full transition-all duration-300 ease-in-out' : 'relative w-20 h-20 mx-5 transition-all duration-300 ease-in-out'}>
      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out -translate-y-1/2 ${expanded ? "text-highlight text-6xl" : " text-dimshadow text-4xl"}  font-extrabold z-10`}
        style={{
          textShadow: expanded ?
            '-5px 0 0 #242424, 0 5px 0 #242424, 5px 0 0  #242424, 0 -5px 0 #242424' :
            '-2px 0 0 #fef8e2, 0 2px 0 #fef8e2, 2px 0 0  #fef8e2, 0 -2px 0 #fef8e2'
        }}
      >
        {elo}
      </div>
      <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out'>
        <Triangle color={expanded ? 'fill-highlight' : 'fill-dimshadow'} h={expanded ? 100 : 65} w={expanded ? 120 : 75} direction={winning ? 'top' : 'bottom'} />
      </div>
    </div>
  )
}

export default ProfileElo