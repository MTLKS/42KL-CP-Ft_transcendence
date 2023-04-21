import React from 'react'
import { FaSadCry } from 'react-icons/fa'

function FriendlistEmpty() {
  return (
    <div className='w-fit h-fit text-center text-2xl flex flex-row items-center text-highlight m-auto gap-x-3'>
      You have no friends... Boohoo <FaSadCry className='animate-bounce text-accYellow'/>
    </div>
  )
}

export default FriendlistEmpty