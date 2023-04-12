import LeaderboardPattern from "./LeaderboardPattern";

function LeaderboardTitle() {
  return (
    <div className='flex flex-row items-center px-4'>
      <LeaderboardPattern align='end' />
      <p className='px-2 uppercase font-extrabold 2xl:text-4xl lg:text-2xl text-highlight'>leaderboard</p>
      <LeaderboardPattern align='start' />
    </div>
  )
}

export default LeaderboardTitle