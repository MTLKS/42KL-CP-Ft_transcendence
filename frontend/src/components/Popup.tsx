import React, { useEffect, useRef, useState } from 'react'
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
  
  const [position, setPosition] = useState(100);
  const { text } = props;

  useEffect(() => {
    setTimeout(() => {
      setPosition(0);
    }, 10);
  }, []);

  return (
    <div
      className='w-fit h-fit flex flex-row items-center rounded-l-xl bg-dimshadow border-solid border-2 lg:border-3 border-highlight overflow-hidden transition-transform transform duration-200 ease-in-out'
      style={{ transform: `translateX(${position}%)`}}
    >
      <div className='p-2.5 text-xl lg:text-2xl text-dimshadow bg-highlight'>
        <FaDizzy className='animate-spin' />
      </div>
      <p className='text-highlight text-sm lg:text-lg text-center flex-grow px-6 w-fit uppercase'>{text}</p>
    </div>
  )
}

interface CollapsiblePopup {
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function CollapsiblePopup(props: CollapsiblePopup) {

  const { icon, content } = props;
  const [opacity, setOpacity] = useState(100);
  const [position, setPosition] = useState("-100px");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // animation: when this component get rendered on screen
  useEffect(() => {
    setTimeout(() => {
      setPosition("0px");
    }, 20);
  }, []);

  useEffect(() => {
    if (isCollapsed)
      setOpacity(50);
    else
      setOpacity(100);
  })

  return (
    <div
      className='bg-dimshadow flex flex-row items-center w-96 h-28 absolute left-0 top-10 rounded-r-2xl border-highlight border-[8px] border-l-0 z-20 overflow-hidden animate-left-to-right transition-all duration-300'
      style={{left: `${position}`, opacity: `${opacity}%`}}
    >
      <div
        className='w-[85%] h-full border-r-8 border-highlight'
        ref={contentRef}
      >
        {content}
      </div>
      <div
        className='w-[15%] h-full relative overflow-hidden cursor-pointer hover:opacity-100'
        onClick={collapseCard}
      >
        <div className='absolute w-60 h-7 -skew-y-[20deg] bg-highlight/20 animate-shine'></div>
        {icon}
      </div>
    </div>
  )

  function collapseCard() {
    if (contentRef.current && !isCollapsed)
      setPosition(`${-contentRef.current.clientWidth}px`);
    else
      setPosition(`0px`);
    setIsCollapsed(!isCollapsed);
  }
}
