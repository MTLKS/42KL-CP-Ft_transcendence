import React from 'react'

interface ProfileStatProps {
  expanded: boolean;
}

function ProfileStat(props: ProfileStatProps) {
  const { expanded } = props;

  return (
    <div className='flex flex-col aspect-square transition-all duration-1000 ease-in-out box-border overflow-hidden'
      style={expanded ? { flex: '1 1 0%' } : { width: "0px" }}>
      <div className='bg-dimshadow h-full flex flex-col justify-center items-center text-highlight font-bold text-xs xl:text-sm overflow-hidden'>
        <div>Highest Elo: 9999</div>
        <div>Longest Win-Streak: 999</div>
        <div>Total Wins: 9999</div>
        <div>Total Losses: 9999</div>
        <br />
        <div
          className='hover:underline truncate text-accRed'
          onMouseOver={() => console.log(`show my worst nightmare`)}
          onMouseLeave={() => console.log(`hide my worst nightmare`)}
        >
          WORST NIGHTMARE
        </div>
        <div
          className='hover:underline text-accCyan'
          onMouseOver={() => console.log(`show my punching bag`)}
          onMouseLeave={() => console.log(`hide my punching bag`)}
        >
          PUNCHING BAG
        </div>
      </div>
      <div className='flex-1 text-center p-1 xl:p-2 font-extrabold text-xs xl:text-base'>
        STATS
      </div>
    </div>
  )
}

export default ProfileStat