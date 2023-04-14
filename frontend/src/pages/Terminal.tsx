import React, { useEffect, useRef } from 'react'
import PromptField from '../components/PromptField'
import SrcollView from '../components/SrcollView'
import Card from '../components/Card'
import login from '../functions/login'
import rickroll from '../functions/rickroll'
import Pong from './Pong'
import sleep from '../functions/sleep'
interface TerminalProps {
  availableCommands: string[];
  handleCommands: (command: string[]) => void;
  elements: JSX.Element[];
  style?: React.CSSProperties;
}

function Terminal(pros: TerminalProps) {
  const { availableCommands, handleCommands, elements, style } = pros;

  const promptFieldRef = useRef<any>(null);

  useEffect(() => {
    promptFieldRef.current?.focusOnInput();
  }, []);

  return (
    <div className='h-full w-full flex flex-col justify-end '
      style={style}
      onClick={() => promptFieldRef.current?.focusOnInput()}
    >
      <SrcollView reverse={true}>
        {elements}
      </SrcollView>
      <div className=' bg-highlight h-1 w-full' />
      <PromptField
        handleCommands={handleCommands}
        availableCommands={availableCommands}
        center={false} ref={promptFieldRef}
      />
    </div>
  )

}

export default Terminal