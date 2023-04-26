import React from 'react'

function ChatMsgIndicator(props: { total: number }) {

  let totalNum = (props.total > 99 ? `99+` : props.total);

  if (totalNum === 0) return <></>

  return (
    <div className='rounded aspect-square h-[30px] bg-accRed font-bold text-highlight text-sm animate-pulse'>
      <p className='h-fit w-fit m-auto mt-1'>{totalNum}</p>
    </div>
  )
}

export default ChatMsgIndicator