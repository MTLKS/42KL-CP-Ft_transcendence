import React from 'react'
import { ImEarth } from 'react-icons/im'

function ChatroomHeader() {
  return (
    <div className='p-5'>
      <div className='w-3/5 py-2 px-4'>
        <p>ROCK&STONE</p>
        <ImEarth />
      </div>
    </div>
  )
}

export default ChatroomHeader