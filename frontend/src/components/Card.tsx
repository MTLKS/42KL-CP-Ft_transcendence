import React from 'react'
import { useState } from 'react';
import sleep from '../functions/sleep';

interface CardProps {
  type: string;
  children: React.ReactNode;
}

interface CardAnimation {
  transform: string,
  opacity: number,
  transition: string,
}

function Card(props: CardProps) {
  const { type = "NOTFOUND", children } = props;
  const [animation, setAnimation] = useState({ transform: "translateY(50px)", opacity: 0, transition: "all 0.5s" } as CardAnimation);
  const [mounted, setMounted] = useState(false);

  if (!mounted) animate();
  return (
    <div className='w-full h-fit flex flex-row items-center border-t-2 border-highlight/[0.5]'
      style={animation}
    >
      <div className='h-full w-5 bg-accRed'>
      </div>
      <div className='w-full bg-highlight/[0.02] text-highlight py-3 px-6'>
        {children}
      </div>
    </div>
  )

  async function animate() {
    await sleep(10);
    setAnimation({ transform: "translateY(0px)", opacity: 1, transition: "all 0.5s" });
    setMounted(true);
  }
}

export default Card