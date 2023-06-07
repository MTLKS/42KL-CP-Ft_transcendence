import React from 'react'
import { FaTableTennis } from 'react-icons/fa'

function ChatGameInvite(props: { sender: string }) {

  const { sender } = props;

  return (
    <div className='w-[65%] h-fit bg-highlight flex flex-row cursor-pointer group items-center'>
      <div className='flex flex-col flex-1 p-4 gap-y-1'>
        <p className='text-sm font-extrabold text-accGreen'>{sender} <span className='font-semibold uppercase text-dimshadow'>challenge you!</span></p>
        <p className='text-xs animate-pulse'>looking for player...</p> {/** in game, looking for player, expired */}
      </div>
      <div className='w-20 p-1 aspect-square bg-highlight'>
        <div className='flex flex-row items-center justify-center w-full h-full bg-dimshadow'>
          <FaTableTennis className='text-4xl text-highlight w-fit h-fit' />
        </div>
      </div>
    </div>
  )
}

export default ChatGameInvite