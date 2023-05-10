import React from 'react'

function ChatroomMessage() {
  return (
    <div className='flex flex-col items-start w-[90%] box-border gap-y-1'>
      {/** TODO: Depending on the sender message, change style */}
      <p className='text-xs font-normal bg-highlight w-fit text-dimshadow cursor-pointer px-1'>pecking duck</p>
      <p className='w-full break-all text-left text-base font-medium text-highlight select-text selection:bg-highlight selection:text-dimshadow'>
        ROCK & STONE, BROTHERS! ROCK & STONE! LEAVE NO DWARF BEHIND!
      </p>
      <p className='text-highlight/50 text-xs font-normal'>12/23/23 04:42pm</p>
    </div>
  )
}

export default ChatroomMessage