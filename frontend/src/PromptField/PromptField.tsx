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
  const [focus, setFocus] = useState(false);

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
    case "ls":
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
      mb-5 border-4
      px-4 rounded-xl h-15'
      style={{borderColor:focus ? "cyan" : "white",transition: "border-color 0.5s"}}
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
          if (e.key === 'ArrowLeft') {
            if (e.currentTarget.selectionStart!+1 == 1) return;
            animateCaret({top: 0, left: 16 + (e.currentTarget.selectionStart!-1) * 19.8});
          }
          if (e.key === 'ArrowRight') {
            if (e.currentTarget.selectionStart!+1 > value.length) return;
            animateCaret({top: 0, left: 16 + (e.currentTarget.selectionStart!+1) * 19.8});
          }

        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onClickCapture={(e) => e.stopPropagation()}
        />
        <div className={' animate-pulse absolute w-5 h-10 bg-white '}
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
      case "ls":
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