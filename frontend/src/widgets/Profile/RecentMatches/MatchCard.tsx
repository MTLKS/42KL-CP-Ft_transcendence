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
    <div className='flex flex-row justify-between w-full h-fit py-2 px-4 border-2 border-highlight border-dashed text-highlight font-extrabold text-lg uppercase'>
      <p className='w-[30%] text-center truncate font-bold'>{props.ply1}</p>
      <p className='text-center text-2xl flex-1'>{props.ply1score}:{props.ply2score}</p>
      <p className='w-[30%] text-center truncate font-bold'>{props.ply2}</p>
    </div>
  )
}

export default MatchCard