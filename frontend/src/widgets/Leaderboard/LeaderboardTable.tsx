import React, { useState } from 'react'
import ScrollView from '../../components/ScrollView';

interface LeaderboardTableProps {
  index: number;
  name: string;
  intraId: string;
  intraURL: string;
  eloRating: number;
}

function LeaderboardTableTitle() {
  return (
    <div className='flex flex-row mb-4 text-xs font-extrabold uppercase text-highlight'>
      <p className='w-[68%] pl-1.5'>name</p>
      <p className='w-[32%] pr.1.5'>ELO Rating</p>
    </div>
  )
}

function LeaderboardTableRow(props: LeaderboardTableProps) {

  const { index, name, intraId, intraURL, eloRating } = props;

  return (
    <div className={`mt-3 snap-center flex flex-row uppercase p-4 border-dashed border-4 ${index < 3 ? "border-highlight" : "border-transparent"}`}>
      <p className='w-[70%]'>{name} <a target='new' className='cursor-pointer hover:underline' href={intraURL}>({intraId})</a></p>
      <p className='w-[30%]'>{eloRating}</p>
    </div>
  )
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

function LeaderboardTable() {

  return (
    <div className='flex flex-col flex-1 overflow-hidden text-sm font-extrabold text-highlight'>
      <LeaderboardTableTitle />
      <div className='flex-1 w-full overflow-auto scrollbar-hide'>
        {
          users.map((user, index) =>
            <LeaderboardTableRow
              key={user.id}
              index={index}
              name={user.name}
              intraId={user.intraId}
              intraURL={user.intraURL}
              eloRating={user.eloRating}
            />)
        }
      </div>
    </div>
  )
}

export default LeaderboardTable