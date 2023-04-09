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
  center: boolean;
  availableCommands: string[];
  commandHighLightColor?: string | null;
  focusColor?: string | null;
  capitalize?: boolean;
}

function PromptField(props: PromptFieldProps) {
  const { handleCommands, center, availableCommands, commandHighLightColor, focusColor, capitalize } = props;
  const caretStart = center ? 300 - 13.23 / 2 : 16;
  const fontWidth: number = center ? 13.23 / 2 : 13.23;
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState({ top: 0, left: caretStart } as offset);
  const [focus, setFocus] = useState(false);
  const [commandHistory, setCommandHistory] = useState([] as string[]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const firstWord: string = value.split(" ")[0];
  const theRest: string = value.split(" ").slice(1).join(" ");
  let color: string = "white";
  availableCommands.forEach((command) => {
    if (firstWord === command) {
      color = commandHighLightColor ?? "white";
    }
  });

  return (
    <div className={center ? 'mx-auto w-[600px]' : 'mx-16'}
    >
      <div className=' relative
      text-white text-2xl tracking-tighter whitespace-pre
      mb-5 border-4 py-2 mx-auto
      px-4 rounded-md h-15 pt-3 pb-2'
        style={{ borderColor: focus ? focusColor ?? "white" : "white", transition: "border-color 0.5s", textAlign: center ? "center" : "left" }}
        onClick={() => { document.querySelector('input')?.focus() }}
      >
        <span className={color} >{firstWord + " "}</span>
        {theRest}
        <input className=' w-0 outline-none bg-transparent text-transparent'
          onInput={(e) => {
            if (capitalize ?? false) setValue(e.currentTarget.value.toUpperCase());
            else setValue(e.currentTarget.value);
            animateCaret({ top: 0, left: caretStart + (e.currentTarget.selectionStart!) * fontWidth });
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onClickCapture={(e) => e.stopPropagation()}
        />
        <div className={' animate-pulse absolute w-2 h-9 bg-white top-2'}
          style={{ left: offset.left }} />
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

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.currentTarget.value = '';
      handleCommands(firstWord);
      let newHistory: string[];
      if (commandHistory.length > 20) newHistory = commandHistory.slice(1);
      else if (commandHistory[commandHistory.length - 1] !== firstWord) newHistory = commandHistory.concat(firstWord);
      else newHistory = commandHistory;
      setCommandHistory(newHistory);
      setValue('');
      setHistoryIndex(-1);
      animateCaret({ top: 0, left: caretStart });
    }
    if (e.key === 'ArrowLeft') {
      if (e.currentTarget.selectionStart! + 1 == 1) return;
      animateCaret({ top: 0, left: caretStart + (e.currentTarget.selectionStart! - 1) * fontWidth });
    }
    if (e.key === 'ArrowRight') {
      if (e.currentTarget.selectionStart! + 1 > value.length) return;
      animateCaret({ top: 0, left: caretStart + (e.currentTarget.selectionStart! + 1) * fontWidth });
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
      animateCaret({ top: 0, left: caretStart + newCommand.length * fontWidth });
    }
    if (e.key === 'ArrowDown') {
      let newHistoryIndex = historyIndex;
      console.log(newHistoryIndex);
      if (historyIndex <= commandHistory.length - 1) newHistoryIndex = historyIndex + 1;
      else if (historyIndex > commandHistory.length - 1) {
        newHistoryIndex = -1;
        e.currentTarget.value = '';
        setValue('');
        animateCaret({ top: 0, left: caretStart });
        return;
      } else return;
      const newCommand = commandHistory[historyIndex];
      e.currentTarget.value = newCommand;
      e.currentTarget.selectionStart = newCommand.length;
      setValue(newCommand);
      setHistoryIndex(newHistoryIndex);
      animateCaret({ top: 0, left: caretStart + newCommand.length * fontWidth });
    }
  }
}

export default PromptField