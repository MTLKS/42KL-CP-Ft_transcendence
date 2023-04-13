import React from 'react'

interface ProfileStatProps {
  expanded: boolean;
}

function ProfileStat(props: ProfileStatProps) {
  const { expanded } = props;

  return (
    <div className='flex flex-col aspect-square transition-all duration-1000 ease-in-out box-border overflow-hidden'
      style={expanded ? { flex: '1 1 0%' } : { width: "0px" }}>
      <div className=' bg-dimshadow h-full flex flex-col justify-center items-center text-highlight font-bold text-sm overflow-hidden'>
        <div>Win: 20</div>
        <div>lose: 20</div>
        <div>MY WORST NIGHTMARE</div>
        <div>MY PUNCHING BAG</div>
      </div>
      <div className='flex-1 text-center p-2 font-extrabold'>
        STATS
      </div>
    </div>
  )
}

export default ProfileStat