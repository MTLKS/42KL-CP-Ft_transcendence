import React from 'react'
import { useState } from 'react';
import sleep from '../functions/sleep';

interface CardProps {
  children: React.ReactNode
}

interface CardAnimation {
  transform: string,
  opacity: number,
  transition: string,
}

function Card(props: CardProps) {
  const { children } = props;
  const [animation, setAnimation] = useState({ transform: "translateY(50px)", opacity: 0, transition: "all 0.5s" } as CardAnimation);
  const [mounted, setMounted] = useState(false);

  if (!mounted) animate();
  return (
    <div className='card'
      style={animation}
    >
      {children}
    </div>
  )

  async function animate() {
    await sleep(10);
    setAnimation({ transform: "translateY(0px)", opacity: 1, transition: "all 0.5s" });
    setMounted(true);
  }
}

export default Card