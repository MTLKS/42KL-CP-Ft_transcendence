import React from 'react'
import LeaderboardPattern from './LeaderboardPattern'
import LeaderboardTitle from './LeaderboardTitle'
import LeaderboardTabs from './LeaderboardTabs'
import LeaderboardTable from './LeaderboardTable'

function Leaderboard() {
  return (
    <div className='w-full flex-1 overflow-hidden px-9 pb-0 flex flex-col gap-y-4 box-border'>
      <LeaderboardTitle />
      <LeaderboardTabs />
      <LeaderboardTable />
    </div>
  )
}

export default Leaderboard