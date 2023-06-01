import React, { useEffect } from 'react'
import LeaderboardPattern from './LeaderboardPattern'
import LeaderboardTitle from './LeaderboardTitle'
import LeaderboardTabs from './LeaderboardTabs'
import LeaderboardTable from './LeaderboardTable'
import { LeaderboardUser } from '../../model/leadeboardUser'
import { set, update } from 'lodash';
import { getHallOfFame } from '../../api/leaderboardAPIs'

function Leaderboard() {
  const [leaderboardUsers, setLeaderboardUsers] = React.useState<LeaderboardUser[]>([]);
  const [type, setType] = React.useState<"hallOfFame" | "hallOfShame">("hallOfFame");

  useEffect(() => {
    getHallOfFame(0, 30).then((newLeaderboardUsers) => {
      setLeaderboardUsers(newLeaderboardUsers);
    });
  }, []);

  return (
    <div className='w-full flex-1 overflow-hidden px-9 pb-0 flex flex-col gap-y-4 box-border'>
      <LeaderboardTitle />
      <LeaderboardTabs replaceLeaderBoardUsers={replaceleaderboardUser} />
      <LeaderboardTable leaderboardUsers={leaderboardUsers} appendLeaderBoardUsers={appendLeaderboardUser} type={type} />
    </div>
  )

  function replaceleaderboardUser(newLeaderboardUsers: LeaderboardUser[], type: "hallOfFame" | "hallOfShame") {
    setLeaderboardUsers(newLeaderboardUsers);
    setType(type);
  }

  function appendLeaderboardUser(newLeaderboardUsers: LeaderboardUser[]) {
    console.log("appendLeaderboardUser");
    setLeaderboardUsers([...leaderboardUsers, ...newLeaderboardUsers]);
  }
}

export default Leaderboard