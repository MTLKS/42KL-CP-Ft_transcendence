import React from 'react'
import { ImEarth } from 'react-icons/im'
import ChatNavbar from '../../ChatNavbar'

function ChatroomHeader() {
  return (
    <div>
      <ChatNavbar>
        <div className='w-3/5 py-2 px-4 text-dimshadow bg-highlight cursor-pointer mx-auto z-20' onClick={() => console.log(`see chat info`)}>
          <div className='flex flex-row items-center gap-3 w-fit mx-auto max-w-[90%]'>
            <p className='font-extrabold text-xl w-fit max-w-[90%] truncate'>ROCK&STONE</p>
            <ImEarth className='text-base' />
          </div>
        </div>
      </ChatNavbar>
    </div>
  )
}

export default ChatroomHeader