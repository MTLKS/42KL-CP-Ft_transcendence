import React from 'react'
import { MatchData } from '../../../model/MatchData'

interface MatchCardProps {
  data: MatchData;
}

function MatchCard(props: MatchCardProps) {
  const { data } = props;
  const { player1, player2, player1Score, player2Score } = data;
  return (
    <div className='flex flex-row justify-between w-full h-fit py-2 px-4 border-2 border-highlight border-dashed text-highlight font-extrabold text-lg uppercase'>
      <p className='w-[30%] text-center truncate font-bold'>{player1.userName}</p>
      <p className='text-center text-2xl flex-1'>{player1Score}:{player2Score}</p>
      <p className='w-[30%] text-center truncate font-bold'>{player2.userName}</p>
    </div>
  )
}

export default MatchCard