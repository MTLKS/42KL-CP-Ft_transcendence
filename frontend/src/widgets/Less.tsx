import React, { useEffect, useRef, useState } from 'react'

interface LineProps {
  data?: string
  match: string
}

function Line(props: LineProps) {
  const { data, match } = props;
  const split = data?.split(' ') || [];
  const elements: JSX.Element[] = [];
  const classNames: string[] = [];
  split.forEach((word, index) => {
    if (match != '' && word.includes(match.slice(1)!)) classNames.push('text-dimshadow bg-highlight');
    else classNames.push('');
    elements.push(
      <span className={classNames[index]} key={index}>
        {word}
      </span>
    );
    elements.push(<span key={index + ' '}>&nbsp;</span>);
  });
  return (
    <p className=' text-highlight whitespace-pre flex flex-wrap'>
      {elements}
    </p>
  )
}

interface LessProps {
  name?: string;
  data?: string;
  onQuit?: () => void;
}

let lastSearch = '';

function Less(props: LessProps) {
  const { onQuit = () => { }, name = "./file/name/place/holder", data = `first \nsecond \nasodij oiajsdo   ijaosidj ahsod hqwuhd iqhwdi hqwid hqiwdh iqhwdi uhqwdih qiwdh iquwhdi hqwid hqiwdh iquwhdi hqwidh qiwudhi qhwdiuh qiwudhiuqh iwhqiwuhd iquhwd iqhwdi uhqwd  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidjasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nasodij oiajsdo ijaosidj  \nend` } = props
  const [numOfLines, setNumOfLines] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [match, setMatch] = useState('');
  const [searching, setSearching] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleResize() {
      if (divRef.current) {
        const height = divRef.current.clientHeight;
        const lineHeight = 24;
        setNumOfLines(Math.floor(height / lineHeight));
      }
    }

    handleResize();
    if (inputRef.current) inputRef.current.focus();

    const divElement = divRef.current as Element;
    const observer = new ResizeObserver(handleResize);
    if (divElement) {
      observer.observe(divElement);
    }
    return () => observer.unobserve(divElement);
  }, []);

  const splitData = data.split('\n');
  const lines: JSX.Element[] = [];
  splitData.forEach((line, index) => {
    if (index >= currentLine && index < currentLine + numOfLines)
      lines.push(<Line key={index} data={line} match={match.slice(1)} />)
  });
  if (splitData.length === 0) lines.push(<Line key={0} data={''} match={match.slice(1)} />);

  return (
    <div className=' flex flex-col text-highlight h-full w-full overflow-hidden'
      onClick={() => {
        if (inputRef.current) inputRef.current.focus();
      }}
    >
      <input className='w-0 h-0' ref={inputRef}
        onKeyDown={onKeyDown}
        onInput={(e) => {
          setMatch(e.currentTarget.value);
          if (e.currentTarget.value[0] === '/') {
            setSearching(true);
          }
        }}
      />
      <div className='h-full flex flex-col px-3 w-full overflow-hidden'
        ref={divRef}
      >
        {lines}
      </div>
      <div className=' h-5 bg-highlight text-dimshadow px-3 mr-auto'>
        <p className='whitespace-pre'>
          {!searching ? `${name} line ${currentLine + 1}/${splitData.length} press 'q' to quit` :
            match}
        </p>

      </div>
    </div>
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      if (currentLine > 0) setCurrentLine(currentLine - 1);
    }
    if (e.key === 'ArrowDown') {
      if (currentLine < splitData.length - numOfLines) setCurrentLine(currentLine + 1);
    }
    if (e.key === 'Enter') {
      if (e.currentTarget.value === '' && currentLine < splitData.length - numOfLines) {
        setCurrentLine(currentLine + 1);
        return;
      }
      e.currentTarget.value = '';
      if (match[0] === '/') {
        searchAndJump();
        return;
      }
      setMatch('');
    }
    if (e.key === 'q') {
      if (!searching) {
        e.currentTarget.value = '';
        setTimeout(() => onQuit(), 10);
      }
    }
    if (e.currentTarget.value[0] === '/') return;


    e.currentTarget.value = '';
  }

  function searchAndJump() {
    let search = match.slice(1);
    let searchIndex = currentLine;
    if (search === '' && lastSearch !== '') {
      setMatch('/' + lastSearch);
      search = lastSearch;
      searchIndex = currentLine + 1;
    }
    let index = splitData.slice(searchIndex).findIndex((line) => line.includes(search));
    if (index === -1) {
      index = splitData.slice(0, searchIndex).findIndex((line) => line.includes(search));
      if (index !== -1) {
        setCurrentLine(index);
        setSearching(false);
        lastSearch = search;
        return;
      }
    }
    if (index !== -1) {
      setCurrentLine(searchIndex + index);
      setSearching(false);
      lastSearch = search;
      return;
    }
    setSearching(false);
  }

}

export default Less