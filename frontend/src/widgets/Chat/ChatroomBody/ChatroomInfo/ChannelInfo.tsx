import React from 'react'
import { ImEarth } from 'react-icons/im'

function ChannelInfo() {
  return (
    <div className='w-[80%] h-fit flex flex-row items-center mx-auto'>
      <div className='flex flex-col items-center gap-y-1 w-[30%] bg-accRed rounded border-dashed border-2 border-highlight py-3 cursor-pointer'>
        <ImEarth className='text-highlight text-7xl' />
        <p className='text-highlight text-base font-extrabold uppercase underline'>public</p>
      </div>
      <div className='flex flex-col gap-y-3 w-full'>
        <div className='flex flex-col gap-y-1'>
          <p className='text-highlight/50 text-sm'>Channel Name</p>
          <input type="text" className='rounded border-2 border-highlight bg-dimshadow text-base font-extrabold text-center text-highlight py-2 px-4 outline-none w-full  cursor-text' />
        </div>
        <div className='flex flex-col gap-y-1'>
          <p className='text-highlight/50 text-sm'>Password</p>
          <input type="password" autoComplete='disabled' autoCorrect='disabled' className='rounded border-2 border-highlight bg-dimshadow text-base font-extrabold text-center text-highlight py-2 px-4 outline-none cursor-text' />
        </div>
      </div>
    </div>
  )
}

export default ChannelInfo