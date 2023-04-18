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
        <div>Win: 20</div>
        <div>lose: 20</div>
        <div
          className='hover:underline truncate'
          onMouseOver={() => console.log(`show my worst nightmare`)}
          onMouseLeave={() => console.log(`hide my worst nightmare`)}
        >
          WORST NIGHTMARE
        </div>
        <div
          className='hover:underline'
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