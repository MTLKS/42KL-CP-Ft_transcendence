import React, { useEffect, useRef } from 'react'
import PromptField, { CommandOptionData } from '../components/PromptField'
import ScrollView from '../components/ScrollView'
import Card from '../components/Card'
import login from '../api/loginAPI'
import rickroll from '../functions/rickroll'
import Pong from './Pong'
import sleep from '../functions/sleep'
import Clock from '../widgets/Clock'
import Game from '../game/Game'
import Queue from '../widgets/Queue'

interface TerminalProps {
  availableCommands: CommandOptionData[];
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
        enableHistory showtip
      />
      <Queue expanded={true} />
      <Clock />
    </div>
  )

}

export default Terminal