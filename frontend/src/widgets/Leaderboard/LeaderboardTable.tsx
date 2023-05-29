import React, { useContext, useState } from 'react'
import ScrollView from '../../components/ScrollView';
import { LeaderboardUser } from '../../model/leadeboardUser';
import { getHallOfFame, getHallOfShame } from '../../api/leaderboardAPIs';
import PreviewProfileContext from '../../contexts/PreviewProfileContext';
import { getProfileOfUser } from '../../api/profileAPI';
import { UserData } from '../../model/UserData';
import Profile from '../Profile/Profile';

interface LeaderboardTableRowProps {
  index: number;
  name: string;
  intraId: string;
  intraURL: string;
  eloRating: number;
}

function LeaderboardTableTitle() {
  return (
    <>
      <div className='px-5 flex flex-row uppercase text-lg text-highlight font-extrabold'>
        <p className='w-[5%]'>#</p>
        <p className='w-[70%] pl-1.5'>name</p>
        <p className='w-[25%] pr.1.5'>ELO Rating</p>
      </div>
      <div className=' h-[2px] mt-2 w-full bg-highlight' />
    </>
  )
}

function LeaderboardTableRow(props: LeaderboardTableRowProps) {

  const { index, name, intraId, intraURL, eloRating } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { setPreviewProfileFunction, setTopWidgetFunction } = useContext(PreviewProfileContext);

  let color = "transparent";
  if (index === 0) {
    color = "yellow-500";
  } else if (index === 1) {
    color = "accCyan";
  } else if (index === 2) {
    color = "accRed";
  } else if (isHovered) {
    color = "highlight";
  }
  let className: string;
  if (isHovered) {
    className = "text-dimshadow bg-" + color;
  }
  else {
    className = "text-highlight bg-transparent";
  }
  console.log(className);

  return (
    <div className={`mt-3 snap-center flex flex-row uppercase p-4 border-dashed border-4 transition-all border-${color}  ${className} `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={onMouseDown}
    >
      <p className='w-[5%]'>{index + 1}</p>
      <p className='w-[70%]'>{name} <a target='new' className='hover:underline cursor-pointer' href={intraURL}>({intraId})</a></p>
      <p className='w-[25%]'>{eloRating}</p>
    </div>
  )

  function onMouseDown() {
    getProfileOfUser(intraId).then((res) => {
      if (res.data) {
        setPreviewProfileFunction(res.data as UserData);
        setTopWidgetFunction(<Profile expanded={true} />)
      }
    });
  }
}

// testing
const users = [
  {
    id: 0,
    name: "joemama",
    intraId: "jmama",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 1,
  },
  {
    id: 1,
    name: "janedoe",
    intraId: "jadoe",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 4,
  },
  {
    id: 2,
    name: "babeeboobu",
    intraId: "bbbb",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 10,
  },
  {
    id: 3,
    name: "ineedsleep",
    intraId: "inesl",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 10,
  },
  {
    id: 4,
    name: "konichiwa",
    intraId: "kncw",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 21,
  },
  {
    id: 5,
    name: "loliloli",
    intraId: "lol",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 35,
  },
  {
    id: 6,
    name: "krapkumkap",
    intraId: "krakap",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 40,
  },
  {
    id: 7,
    name: "brrrice",
    intraId: "brce",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 42,
  },
  {
    id: 8,
    name: "hello",
    intraId: "hlo",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 48,
  },
  {
    id: 9,
    name: "shawn tee young",
    intraId: "shawty",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 52,
  },
  {
    id: 10,
    name: "hello",
    intraId: "hlo",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 48,
  },
  {
    id: 11,
    name: "hell",
    intraId: "hl",
    intraURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    eloRating: 48,
  },
]

interface LeaderboardTableProps {
  leaderboardUsers: LeaderboardUser[];
  appendLeaderBoardUsers: (users: LeaderboardUser[]) => void;
  type: "hallOfFame" | "hallOfShame";
}

function LeaderboardTable(props: LeaderboardTableProps) {
  const { leaderboardUsers, type, appendLeaderBoardUsers } = props;

  return (
    <div className='text-highlight flex-1 overflow-hidden font-extrabold text-sm flex flex-col'>
      <LeaderboardTableTitle />
      <div className='overflow-auto w-full flex-1 scrollbar-hide'
        onScroll={handleScroll}
      >
        {
          leaderboardUsers.map((user, index) =>
            <LeaderboardTableRow
              key={index}
              index={index}
              name={user.userName}
              intraId={user.intraName}
              intraURL={user.intraUrl}
              eloRating={user.elo}
            />)
        }
      </div>
    </div>
  )

  function handleScroll(e: any) {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (leaderboardUsers.length % 30 > 0) return;
    if (bottom) {
      if (type === "hallOfFame") {
        getHallOfFame(Math.floor(leaderboardUsers.length / 30), 30).then((users) => {
          appendLeaderBoardUsers(users);
        });
      }
      else if (type === "hallOfShame") {
        getHallOfShame(Math.floor(leaderboardUsers.length / 30), 30).then((users) => {
          appendLeaderBoardUsers(users);
        });
      }
    }
  }
}

export default LeaderboardTable