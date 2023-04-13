import React from 'react'
import LeaderboardPattern from './LeaderboardPattern'
import LeaderboardTitle from './LeaderboardTitle'
import LeaderboardTabs from './LeaderboardTabs'
import LeaderboardTable from './LeaderboardTable'

function Leaderboard() {
  return (
    <div className='w-full h-full p-9 pb-0 flex flex-col gap-y-4'>
      <LeaderboardTitle />
      <LeaderboardTabs />
      <LeaderboardTable />
    </div>
  )
}

export default Leaderboard