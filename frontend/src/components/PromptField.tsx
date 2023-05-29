import React, { Fragment, Ref, createRef, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import sleep from '../functions/sleep'
import login from '../api/loginAPI'
import rickroll from '../functions/rickroll'
import { flushSync } from 'react-dom';

interface offset {
  top: number,
  left: number,
}

interface PromptFieldProps {
  handleCommands: (commands: string[], fullstring: string) => void;
  center: boolean;
  availableCommands?: CommandOptionData[];
  commandClassName?: string | null;
  focusColor?: string | null;
  capitalize?: boolean;
  errorClassName?: string | null;
  wrap?: boolean;
  enableHistory?: boolean;
  showtip?: boolean;
}

interface CommandOptionDataProps {
  command?: string;
  options?: string[];
  parameters?: string;
}

export class CommandOptionData {
  command: string;
  options: string[];
  parameter: string;
  constructor({ command, options, parameters }: CommandOptionDataProps) {
    this.command = command ?? "";
    this.options = options ?? [];
    this.parameter = parameters ?? "";
  }

  isCommand(command: string, commandLength: number): boolean {
    if (commandLength > 1)
      return command === this.command;
    return this.command.startsWith(command);
  }

  findOption(option: string, commandLength: number): string | undefined {
    if (commandLength > 2)
      return this.options.find((opt) => opt === option);
    return this.options.find((opt) => opt.startsWith(option));
  }
}

const PromptField = forwardRef((props: PromptFieldProps, ref) => {
  const { handleCommands, center, availableCommands = [], commandClassName,
    focusColor, capitalize, errorClassName, wrap, enableHistory = false, showtip = false } = props;
  const caretStart = center ? 300 - 13.23 / 2 : 4;
  const fontWidth: number = 10;
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState({ top: 12, left: caretStart } as offset);
  const [toolTipOffset, setToolTipOffset] = useState({ top: 0, left: 0 } as offset);
  const [focus, setFocus] = useState(false);
  const [commandHistory, setCommandHistory] = useState([] as string[]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = createRef<HTMLInputElement>();
  const divRef = createRef<HTMLDivElement>();

  const splitValue: string[] = value.split(" ");
  const words: string[] = splitValue.filter((word) => word !== "");
  let spansStyles: string[] = [];

  useEffect(() => {
    setCommandHistory(JSON.parse(localStorage.getItem("commandHistory") ?? "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("commandHistory", JSON.stringify(commandHistory));
  }, [commandHistory]);

  useImperativeHandle(ref, () => ({
    focusOnInput() {
      inputRef.current!.focus();
    }
  }));

  checkValid();
  const lastRef = useRef<HTMLSpanElement>(null);

  const spans = useMemo(() => {
    let spans: JSX.Element[] = splitValue
      .map((word, index) =>

        <Fragment key={index}>
          <span ref={index === splitValue.length - 1 ? lastRef : null} className={`${spansStyles[index]} whitespace-pre`}>{word}</span>
          &nbsp;
        </Fragment>
      )
    if (splitValue.length === 1 && splitValue[0] === "") spans = [];
    return spans;
  }, [value]);


  useLayoutEffect(() => {
    if (lastRef.current) {
      setToolTipOffset({ top: lastRef.current.offsetTop, left: lastRef.current.offsetLeft });
    }
  }, [lastRef.current]);


  useEffect(() => {
    if (inputRef.current) {
      if (inputRef.current.value === '')
        animateCaret({ top: inputRef.current!.offsetTop, left: inputRef.current!.offsetLeft });
      else if (inputRef.current!.value.length > value.length)
        animateCaret({ top: inputRef.current!.offsetTop, left: inputRef.current!.offsetLeft + fontWidth });
      else
        animateCaret({ top: inputRef.current!.offsetTop, left: inputRef.current!.offsetLeft - fontWidth });
    }
    inputRef.current!.focus();
  }, [value]);

  const { toolTipCommand, toolTipOption, toolTipParameter, toolTipDisplay } = useMemo(() => {
    const selectCommand = availableCommands.find((command) => command.isCommand(splitValue[0], splitValue.length));
    const toolTipCommand: string | undefined = selectCommand?.command;

    let toolTipOption: string | undefined = undefined;
    if (splitValue.length === 2) toolTipOption = selectCommand?.findOption(splitValue[1], splitValue.length);
    let toolTipParameter: string | undefined = undefined;
    if (splitValue.length >= 3) toolTipParameter = selectCommand?.parameter;

    let toolTipDisplay: string | undefined = undefined;
    if (splitValue.length === 1) toolTipDisplay = toolTipCommand;
    else if (splitValue.length === 2) toolTipDisplay = toolTipOption;
    else toolTipDisplay = toolTipParameter;

    return { toolTipCommand, toolTipOption, toolTipParameter, toolTipDisplay };
  }, [value])


  return (
    <div className={center ? 'mx-auto w-[600px]' : 'mx-2'}
    >
      <div className=' relative
      text-highlight text-2xl tracking-tighter whitespace-pre
      mx-auto flex
      px-1 rounded-md h-15 pt-3 pb-3 cursor-text'
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
        <input className='  w-0 outline-none bg-transparent text-transparent'
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
        <div className=' absolute opacity-20'
          style={{
            display: toolTipDisplay && value !== "" && showtip ? "" : "none",
            left: toolTipOffset.left, top: toolTipOffset.top
          }}
        >
          {toolTipDisplay}
        </div>
        <div className={'animate-pulse absolute w-2 h-9 bg-highlight top-2'}
          style={{ left: offset.left, top: offset.top }} />
      </div>
    </div>
  )

  function focusOnInput() {
    inputRef.current!.focus();
  }

  function checkValid() {
    splitValue.forEach((element, index) => {
      if (element === "") {
        spansStyles.push('');
        return;
      }
      if (index == 0) {
        let found = false;
        availableCommands.forEach((command) => {
          if (command.isCommand(element, splitValue.length)) {
            spansStyles.push(commandClassName ?? '');
            found = true;
          }
        });
        if (!found) spansStyles.push(errorClassName ?? "underline decoration-3 decoration-accRed");
      } else if (index == 1) {
        let found = false;
        availableCommands.forEach((command) => {
          if (command.findOption(element, splitValue.length)) {
            spansStyles.push(commandClassName ?? '');
            found = true;
          }
        });
        if (!found) spansStyles.push(errorClassName ?? "underline decoration-3 decoration-accRed");
      } else {
        spansStyles.push('');
      }
    });
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
      let newHistory = [...commandHistory];
      if (commandHistory[commandHistory.length - 1] !== value && value) newHistory.push(value);
      if (newHistory.length >= 20) newHistory = newHistory.slice(1);
      setCommandHistory(newHistory);
      setValue('');
      setHistoryIndex(-1);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') e.preventDefault();
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && enableHistory) {
      let newHistoryIndex = historyIndex;
      e.preventDefault();
      if ((historyIndex === -1 && e.key === 'ArrowDown') || (historyIndex === 0 && e.key === 'ArrowUp')) return;
      if (e.key === 'ArrowUp' && historyIndex === -1) newHistoryIndex = commandHistory.length - 1;
      else if (e.key === 'ArrowUp') newHistoryIndex -= 1;
      if (e.key === 'ArrowDown' && historyIndex === commandHistory.length - 1) newHistoryIndex = -1;
      else if (e.key === 'ArrowDown') newHistoryIndex += 1;
      if (newHistoryIndex === -1) {
        e.currentTarget.value = '';
        setValue('');
        setHistoryIndex(-1);
        return;
      }
      const newCommand = commandHistory[newHistoryIndex];
      e.currentTarget.value = newCommand;
      e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
      setValue(newCommand);
      setHistoryIndex(newHistoryIndex);
    }
    if (e.key === 'Tab' || e.key === 'ArrowRight' && toolTipCommand) {
      e.preventDefault();
      if (toolTipCommand && splitValue.length === 1) {
        e.currentTarget.value = toolTipCommand;
        setValue(toolTipCommand);
      }
      else if (toolTipOption && splitValue.length === 2) {
        const finalString = toolTipCommand + ' ' + toolTipOption;
        e.currentTarget.value = finalString;
        setValue(finalString);
      }
    }
  }
})

export default PromptField