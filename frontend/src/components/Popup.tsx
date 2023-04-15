import React from 'react'
import { FaDizzy, FaTableTennis } from 'react-icons/fa'
import Button from './Buttons';

interface ErrorPopupProps {
  text: string;
}

export function CookiePopup() {
  return (
    <div className='w-fit h-fit rounded-2xl bg-dimshadow text-highlight border-highlight border-4 overflow-hidden'>
      <div className='p-8'> 
        <div className='flex flex-row items-center text-3xl'>
          <p className='highlight relative font-extrabold capitalize z-10'>
            we uses cookies
          </p>
          <FaTableTennis className='ml-3.5 text-2xl'/>
        </div>
        <p className='font-normal text-base mt-4'>Accepting cookies is the secret to becoming a ping pong champion. Trust us, we're the experts!</p>
      </div>
      <div className='overflow-hidden flex flex-row divide-highlight divide-x-4 border-t-4 border-highlight'>
        <Button
          title='Nahhh'
          textTransform='uppercase'
          flex='1'
          padding='3'
          bgColor='dimshadow'
          textColor='highlight'
          />
        <Button
          title='Erm... Sure?'
          textTransform='uppercase'
          flex='1'
          padding='3'
          bgColor='dimshadow'
          textColor='highlight'
        />
      </div>
    </div>
  )
}

export function ErrorPopup(props: ErrorPopupProps) {
  
  const { text } = props;

  return (
    <div className='w-fit h-fit flex flex-row items-center rounded-l-xl bg-dimshadow border-solid border-2 lg:border-3 border-highlight overflow-hidden'>
      <div className='p-2.5 text-xl lg:text-2xl text-dimshadow bg-highlight'>
        <FaDizzy className='animate-spin' />
      </div>
      <p className='text-highlight text-sm lg:text-lg text-center flex-grow px-6 w-fit uppercase'>{text}</p>
    </div>
  )
}
