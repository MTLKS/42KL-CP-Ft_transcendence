import React, { useEffect, useRef } from 'react'
import PromptField from '../components/PromptField'
import ScrollView from '../components/ScrollView'
import Card from '../components/Card'
import login from '../functions/login'
import rickroll from '../functions/rickroll'
import Pong from './Pong'
import sleep from '../functions/sleep'
import Clock from '../widgets/Clock'
import Game from '../game/Game'
interface TerminalProps {
  availableCommands: string[];
  handleCommands: (command: string[]) => void;
  elements: JSX.Element[];
  startMatch: boolean;
}

function Terminal(pros: TerminalProps) {
  const { availableCommands, handleCommands, elements, startMatch } = pros;

  const promptFieldRef = useRef<any>(null);

  useEffect(() => {
    promptFieldRef.current?.focusOnInput();
  }, []);

  return (
    <div className='h-full flex-1 flex flex-col justify-end relative'
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
      {startMatch ? <Game /> : null}
      <Clock />
    </div>
  )

}

export default Terminal