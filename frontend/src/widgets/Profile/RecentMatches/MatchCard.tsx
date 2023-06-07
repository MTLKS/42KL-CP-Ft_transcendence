import React from 'react'

interface MatchCardProps {
  id: number,
  ply1: string,
  ply2: string,
  ply1score: number,
  ply2score: number,
}

function MatchCard(props: MatchCardProps) {
  return (
    <div className='flex flex-row justify-between w-full px-4 py-2 text-lg font-extrabold uppercase border-2 border-dashed h-fit border-highlight text-highlight'>
      <p className='w-[30%] text-center truncate font-bold'>{props.ply1}</p>
      <p className='flex-1 text-2xl text-center'>{props.ply1score}:{props.ply2score}</p>
      <p className='w-[30%] text-center truncate font-bold'>{props.ply2}</p>
    </div>
  )
}

export default MatchCard