import React, { useState } from 'react'

interface LeaderboardTabsProps {
  onClick?: () => void;
}

/**
 * @state isActive: to identify which tab is currently active
 */
function LeaderboardTabs(props: LeaderboardTabsProps) {

  const [isActive, setIsActive] = useState(true);

  return (
    <div className='flex flex-row justify-end text-sm font-bold uppercase text-highlight'>
      <button type='button' className='p-2 active:bg-highlight active:text-dimshadow hover:bg-highlight hover:text-dimshadow'>HALL OF FAME</button>
      <button type='button' className='p-2 active:bg-highlight active:text-dimshadow hover:bg-highlight hover:text-dimshadow'>HALL OF SHAME</button>
    </div>
  )
}

export default LeaderboardTabs