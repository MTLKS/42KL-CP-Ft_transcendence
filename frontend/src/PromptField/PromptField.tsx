import React, { useState } from 'react'
import sleep from '../functions/sleep'
import login from '../functions/login'
import rickroll from '../functions/rickroll'

interface offset {
  top: number,
  left: number,
}

interface PromptFieldProps {
  handleCommands: (command: string) => void;
}

function PromptField(props: PromptFieldProps) {
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState({ top: 0, left: 16 } as offset);
  const [focus, setFocus] = useState(false);
  const [commandHistory, setCommandHistory] = useState([] as string[]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const firstWord: string = value.split(" ")[0];
  const theRest: string = value.split(" ").slice(1).join(" ");
  const fontWidth: number = 13.23;
  let color: string = "white";
  switch (firstWord) {
    case "help":
    case "login":
    case "sudo":
    case "leaderboard":
    case "ok":
    case "cowsay":
    case "clear":
    case "ls":
    case "add":
      color = "cyan";
      break;
    default:
      color = "red";
      break;
  }

  return (
    <div className='mx-16'>
      <div className=' relative bg-slate-600 
      text-gray-300 text-2xl tracking-tighter whitespace-pre
      mb-5 border-4 
      px-4 rounded-xl h-15'
        style={{ borderColor: focus ? "cyan" : "white", transition: "border-color 0.5s" }}
        onClick={() => { document.querySelector('input')?.focus() }}
      >
        <span style={{ color: color }}>{firstWord + " "}</span>
        {theRest}
        <input className=' w-0 outline-none bg-transparent text-transparent'
          onInput={(e) => {
            setValue(e.currentTarget.value);
            animateCaret({ top: 0, left: 16 + (e.currentTarget.selectionStart!) * fontWidth });
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.value = '';
              props.handleCommands(firstWord);
              let newHistory: string[];
              if (commandHistory.length > 20) newHistory = commandHistory.slice(1);
              else if (commandHistory[commandHistory.length - 1] !== firstWord) newHistory = commandHistory.concat(firstWord);
              else newHistory = commandHistory;
              setCommandHistory(newHistory);
              setValue('');
              setHistoryIndex(-1);
              animateCaret({ top: 0, left: 16 });
            }
            if (e.key === 'ArrowLeft') {
              if (e.currentTarget.selectionStart! + 1 == 1) return;
              animateCaret({ top: 0, left: 16 + (e.currentTarget.selectionStart! - 1) * fontWidth });
            }
            if (e.key === 'ArrowRight') {
              if (e.currentTarget.selectionStart! + 1 > value.length) return;
              animateCaret({ top: 0, left: 16 + (e.currentTarget.selectionStart! + 1) * fontWidth });
            }
            if (e.key === 'ArrowUp') {
              let newHistoryIndex = historyIndex;
              if (commandHistory.length == 0) return;
              if (historyIndex == -1) newHistoryIndex = commandHistory.length - 1;
              else if (historyIndex > 0) newHistoryIndex = historyIndex - 1;
              else return;
              const newCommand = commandHistory[newHistoryIndex];
              console.log(historyIndex - 1);
              e.currentTarget.value = newCommand;
              e.currentTarget.selectionStart = newCommand.length;
              setValue(newCommand);
              setHistoryIndex(newHistoryIndex)
              animateCaret({ top: 0, left: 16 + newCommand.length * fontWidth });
            }
            if (e.key === 'ArrowDown') {
              let newHistoryIndex = historyIndex;
              console.log(newHistoryIndex);
              if (historyIndex <= commandHistory.length - 1) newHistoryIndex = historyIndex + 1;
              else if (historyIndex > commandHistory.length - 1) {
                newHistoryIndex = -1;
                e.currentTarget.value = '';
                setValue('');
                animateCaret({ top: 0, left: 16 });
                return;
              } else return;
              const newCommand = commandHistory[historyIndex];
              e.currentTarget.value = newCommand;
              e.currentTarget.selectionStart = newCommand.length;
              setValue(newCommand);
              setHistoryIndex(newHistoryIndex);
              animateCaret({ top: 0, left: 16 + newCommand.length * fontWidth });
            }
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onClickCapture={(e) => e.stopPropagation()}
        />
        <div className={' animate-pulse absolute w-4 h-8 bg-white '}
          style={{ top: offset.top, left: offset.left }} />
      </div>
    </div>
  )

  function lerpOffset(a: offset, b: offset, t: number) {
    return { top: a.top + (b.top - a.top) * t, left: a.left + (b.left - a.left) * t };
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