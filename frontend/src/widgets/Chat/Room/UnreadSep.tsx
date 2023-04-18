import React from 'react'

function UnreadSep() {
  return (
    <div className='flex flex-row items-center box-border'>
      <div className=' bg-highlight h-1 flex-1' />
      <div className=' text-highlight mx-2'>NEW</div>
      <div className=' bg-highlight h-1 flex-1' />
    </div>
  )
}

export default UnreadSep