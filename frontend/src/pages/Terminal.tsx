import React, { useEffect, useRef } from 'react'
import PromptField from '../components/PromptField'
import ScrollView from '../components/ScrollView'
import Card from '../components/Card'
import login from '../functions/login'
import rickroll from '../functions/rickroll'
import Pong from './Pong'
import sleep from '../functions/sleep'
import Clock from '../widgets/Clock'
interface TerminalProps {
  availableCommands: string[];
  handleCommands: (command: string[]) => void;
  elements: JSX.Element[];
}

function Terminal(pros: TerminalProps) {
  const { availableCommands, handleCommands, elements } = pros;

  const promptFieldRef = useRef<any>(null);

  useEffect(() => {
    promptFieldRef.current?.focusOnInput();
  }, []);

  return (
    <div className='h-full w-full flex flex-col justify-end relative'
      onClick={() => promptFieldRef.current?.focusOnInput()}
    >
      <ScrollView reverse={true}>
        {elements}
      </ScrollView>
      <div className=' bg-highlight h-1 w-full' />
      <PromptField
        handleCommands={handleCommands}
        availableCommands={availableCommands}
        center={false} ref={promptFieldRef}
      />
      <Clock />
    </div>
  )

}

export default Terminal