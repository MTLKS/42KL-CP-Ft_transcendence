import React from 'react'
import LeaderboardPattern from './LeaderboardPattern'
import LeaderboardTitle from './LeaderboardTitle'
import LeaderboardTabs from './LeaderboardTabs'
import LeaderboardTable from './LeaderboardTable'

function Leaderboard() {
  return (
    <div className='flex flex-col flex-1 w-full pb-0 overflow-hidden px-9 gap-y-4 box-border'>
      <LeaderboardTitle />
      <LeaderboardTabs />
      <LeaderboardTable />
    </div>
  )
}

export default Leaderboard