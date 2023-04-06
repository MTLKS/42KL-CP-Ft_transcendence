import React, { useState } from 'react'
import sleep from '../functions/sleep'
import login from '../functions/login'
import rickroll from '../functions/rickroll'

interface offset{
  top: number,
  left: number,
}

function PromptField() {
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState({top:0, left:16} as offset);

  const firstWord:string = value.split(" ")[0];
  const theRest:string = value.split(" ").slice(1).join(" ");
  let color:string = "white";
  switch (firstWord) {
    case "help":
    case "login":
    case "sudo":
    case "leaderboard":
    case "ok":
    case "cowsay":
    case "clear":
      color ="cyan";
      break;
    default:
        color = "red";
      break;
  }

  return (
    <div className='mx-16'>
      <p className=' relative bg-slate-600 
      text-gray-300 text-4xl tracking-tighter
      mb-5 border-4 border-white
      px-4 rounded-xl h-15'
      onClick={() => {document.querySelector('input')?.focus()}}
      >
        <span style={{color:color}}>{firstWord + " "}</span>
        {theRest} 
        <input className=' w-0 outline-none bg-transparent text-transparent' 
        onInput={(e) =>{ 
          setValue(e.currentTarget.value);
          animateCaret({top: 0, left: 16 + (e.currentTarget.selectionStart!) * 19.8});
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCommand();
          }
          if (e.key === 'ArrowLeft'|| e.key === 'ArrowRight') {
            animateCaret({top: 0, left: 16 + (e.currentTarget.selectionStart!) * 19.8});
          }
        }}
        onClickCapture={(e) => e.stopPropagation()}
        />
        <div className={' animate-pulse absolute w-5 h-11 bg-white '}
        style={{top:offset.top, left:offset.left }}/>
      </p>
    </div>
  )

  function handleCommand() {
    console.log("submit: "+firstWord);
    switch (firstWord) {
      case "login":
          login();
        break;
      case "sudo":
          rickroll();
        break;
      default:
        break;
    }
  }

  function lerpOffset(a:offset, b:offset, t:number) {
    return {top: a.top + (b.top - a.top) * t, left: a.left + (b.left - a.left) * t};
  }
  async function animateCaret(final: offset) {
    const start = offset;
    const end = final;
    const duration = 30;
    const steps = 10;
    const step = 1 / steps;
    for (let i = 0; i < steps; i++) {
      const t = i * step;
      setOffset(lerpOffset(start, end, t));
      await sleep(duration / steps);
    }
    setOffset(end);
  }
}

export default PromptField