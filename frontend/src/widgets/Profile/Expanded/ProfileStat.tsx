import React from 'react'

interface ProfileStatProps {
  expanded: boolean;
}

function ProfileStat(props: ProfileStatProps) {
  const { expanded } = props;

  return (
    <div className='flex flex-col overflow-hidden aspect-square transition-all duration-1000 ease-in-out box-border'
      style={expanded ? { flex: '1 1 0%' } : { width: "0px" }}>
      <div className='flex flex-col items-center justify-center h-full overflow-hidden text-xs font-bold bg-dimshadow text-highlight xl:text-sm'>
        <div>Win: 20</div>
        <div>lose: 20</div>
        <div
          className='truncate hover:underline'
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
      <div className='flex-1 p-1 text-xs font-extrabold text-center xl:p-2 xl:text-base'>
        STATS
      </div>
    </div>
  )
}

export default ProfileStat