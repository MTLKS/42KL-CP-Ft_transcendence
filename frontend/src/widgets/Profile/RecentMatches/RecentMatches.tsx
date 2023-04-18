import React, { useEffect, useState } from 'react'
import sleep from '../../../functions/sleep';
import MatchCard from './MatchCard';

interface RecentMatchesProps {
  expanded: boolean;
}

const matches = [
  {
    id: 1,
    ply1: 'joe',
    ply2: 'mama',
    ply1score: 2,
    ply2score: 3,
  },
  {
    id: 2,
    ply1: 'joeeeeeeeeeeeeee',
    ply2: 'mamamamamamamama',
    ply1score: 100,
    ply2score: 300,
  },
  {
    id: 3,
    ply1: 'joe',
    ply2: 'mama',
    ply1score: 2,
    ply2score: 3,
  },
]

function RecentMatches(props: RecentMatchesProps) {
  const { expanded } = props;
  const maxHeight = 300;
  const [height, setHeight] = useState(0);
  const matchCards = matches.map((match, index) => <MatchCard key={match.id} {...match} />)

  useEffect(() => {
    if (height == 0 && expanded)
      animateHeight();
    if (height == maxHeight && !expanded)
      setHeight(0);
  }, [expanded]);

  return (
    <div className='flex flex-col overflow-hidden border-box bg-dimshadow mb-1 w-full transition-all duration-500 ease-in-out gap-2'
      style={{ height: height }}
    >
      <div className='w-[80%] mx-auto'>
        <p className='uppercase text-sm text-highlight font-normal mx-auto mt-8 mb-2'>recent matches</p>
        <div className='flex flex-col mx-auto gap-y-4'>
          {matchCards}
        </div>
      </div>
    </div>
  )

  async function animateHeight() {
    await sleep(500);
    setHeight(maxHeight);
  }
}

export default RecentMatches