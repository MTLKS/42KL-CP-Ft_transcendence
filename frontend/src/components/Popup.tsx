import React from 'react'
import { FaAddressCard, FaDizzy } from 'react-icons/fa'

interface ErrorPopupProps {
  text: string;
}

export function ErrorPopup(props: ErrorPopupProps) {
  
  const { text } = props;

  return (
    <div className='w-fit h-fit flex flex-row items-center rounded-l-xl bg-dimshadow border-solid border-4 border-highlight'>
      <div className='p-2.5 text-3xl text-dimshadow bg-highlight'>
        <FaDizzy className='animate-spin' />
      </div>
      <p className='text-highlight text-xl text-center flex-grow px-6 w-fit uppercase'>{text}</p>
    </div>
  )
}
