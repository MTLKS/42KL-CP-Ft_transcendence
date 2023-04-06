import React, { useState } from 'react'
import sleep from '../functions/sleep'

interface offset{
  top: number,
  left: number,
}

function PromptField() {
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState({top:0, left:16} as offset);

  function lerpOffset(a:offset, b:offset, t:number) {
    return {top: a.top + (b.top - a.top) * t, left: a.left + (b.left - a.left) * t};
  }
  async function animateCaret(final: offset) {
    const start = offset;
    const end = final;
    const duration = 100;
    const steps = 10;
    const step = 1 / steps;
    for (let i = 0; i < steps; i++) {
      const t = i * step;
      setOffset(lerpOffset(start, end, t));
      await sleep(duration / steps);
    }
    setOffset(end);
  }

  return (
    <div className='mx-16'>
      <div className=' relative bg-slate-600 
      text-gray-300 text-4xl tracking-tighter
      mb-5 border-4 border-white
      px-4 rounded-xl h-15'
      onClick={() => {document.querySelector('input')?.focus()}}
      >
        {value} 
        
        <input className=' w-0 outline-none bg-transparent text-transparent' 
        onInput={(e) =>{ 
          setValue(e.currentTarget.value);
          animateCaret({top: 0, left: 16 + (value.length+1) * 19.8});
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
        console.log(e.key);}}
        onClickCapture={(e) => e.stopPropagation()}
        />
        <div className={' animate-pulse absolute w-4 h-11 bg-white '}
        style={{top:offset.top, left:offset.left }}/>
      </div>
    </div>
  )
}

export default PromptField