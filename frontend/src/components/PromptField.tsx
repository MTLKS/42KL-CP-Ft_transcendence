import React, { Ref, createRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import sleep from '../functions/sleep'
import login from '../functions/login'
import rickroll from '../functions/rickroll'

interface offset {
  top: number,
  left: number,
}

interface PromptFieldProps {
  handleCommands: (commands: string[], fullstring: string) => void;
  center: boolean;
  availableCommands: string[];
  commandClassName?: string | null;
  focusColor?: string | null;
  capitalize?: boolean;
  errorClassName?: string | null;
  wrap?: boolean;
}

const PromptField = forwardRef((props: PromptFieldProps, ref) => {
  const { handleCommands, center, availableCommands, commandClassName, focusColor, capitalize, errorClassName, wrap } = props;
  const caretStart = center ? 300 - 13.23 / 2 : 4;
  const fontWidth: number = 10;
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState({ top: 0, left: caretStart } as offset);
  const [focus, setFocus] = useState(false);
  const [commandHistory, setCommandHistory] = useState([] as string[]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = createRef<HTMLInputElement>();
  const divRef = createRef<HTMLDivElement>();

  const splitValue: string[] = value.split(" ");
  const words: string[] = splitValue.filter((word) => word !== "");
  let spansStyles: string[] = [];

  useImperativeHandle(ref, () => ({
    focusOnInput() {
      inputRef.current!.focus();
    }
  }));

  checkValid();

  let spans: JSX.Element[];

  spans = splitValue
    .map((word, index) =>
      <>
        <span key={index} className={`${spansStyles[index]} whitespace-pre`}>{word}</span>
        &nbsp;
      </>
    )
  if (splitValue.length === 1 && splitValue[0] === "") spans = [];

  useEffect(() => {
    if (inputRef.current) {
      if (inputRef.current.value === '')
        animateCaret({ top: inputRef.current!.offsetTop, left: inputRef.current!.offsetLeft });
      else if (inputRef.current!.value.length > value.length)
        animateCaret({ top: inputRef.current!.offsetTop, left: inputRef.current!.offsetLeft + fontWidth });
      else
        animateCaret({ top: inputRef.current!.offsetTop, left: inputRef.current!.offsetLeft - fontWidth });
    }
  }, [value]);
  return (
    <div className={center ? 'mx-auto w-[600px]' : 'mx-2'}
    >
      <div className=' relative
      text-highlight text-2xl tracking-tighter whitespace-pre
      mx-auto overflow-hidden flex
      px-1 rounded-md h-15 pt-3 pb-3'
        style={{
          borderColor: focus ? focusColor ?? "#fef8e2" : "#fef8e2", transition: "border-color 0.5s",
          textAlign: center ? "center" : "left", borderWidth: center ? "4px" : 0,
          placeContent: center ? "center" : "flex-start",
          flexWrap: wrap ? "wrap" : "nowrap"
        }}
        onClick={focusOnInput}
        ref={divRef}
      >
        {spans}
        <input className=' w-0 outline-none bg-transparent text-transparent'
          ref={inputRef}
          onInput={(e) => {

            if (capitalize ?? false) setValue(e.currentTarget.value.toUpperCase());
            else setValue(e.currentTarget.value);
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
          onFocus={(e) => {
            e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
            setFocus(true)
          }}
          onBlur={() => setFocus(false)}
          onClickCapture={(e) => e.stopPropagation()}
        />
        <div className={'animate-pulse absolute w-2 h-9 bg-highlight top-2'}
          style={{ left: offset.left, top: offset.top }} />
      </div>
    </div>
  )

  function focusOnInput() {
    inputRef.current!.focus();
  }

  function checkValid() {

    let index = 0;
    for (const val in splitValue) {

      const element = val;
      if (element === "") {
        spansStyles.push('');
        continue;
      }
      if (index == 0) {
        if (availableCommands.includes(element))
          spansStyles.push(commandClassName ?? '');
        else
          spansStyles.push(errorClassName ?? "underline decoration-3 decoration-accRed");
      }
      else {
        spansStyles.push('');
      }
      index++;
    }
  }

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
      handleCommands(words, value);
      let newHistory: string[];
      if (commandHistory.length > 20) newHistory = commandHistory.slice(1);
      else if (commandHistory[commandHistory.length - 1] !== words[0]) newHistory = commandHistory.concat(words[0]);
      else newHistory = commandHistory;
      setCommandHistory(newHistory);
      setValue('');
      setHistoryIndex(-1);
      animateCaret({ top: 0, left: caretStart });
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
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
})

export default PromptField