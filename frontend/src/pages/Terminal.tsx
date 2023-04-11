import React from 'react'
import PromptField from '../PromptField/PromptField'
import SrcollView from '../components/SrcollView'
import Card from '../components/Card'
import login from '../functions/login'
import rickroll from '../functions/rickroll'
import Pong from './Pong'
import sleep from '../functions/sleep'
interface TerminalProps {
  availableCommands: string[];
  handleCommands: (command: string) => void;
  elements: JSX.Element[];
}

function Terminal(pros: TerminalProps) {
  const { availableCommands, handleCommands, elements } = pros;
  // const [elements, setElements] = React.useState([] as JSX.Element[])
  // const [index, setIndex] = React.useState(0);
  // const [startMatch, setStartMatch] = React.useState(false);

  focusOnInput();
  return (
        <div className='h-full w-full flex flex-col justify-end '>
          <SrcollView reverse= {true}>
            {elements}
          </SrcollView>
          <div className=' bg-highlight h-1 w-full'/>
          <PromptField
            handleCommands={handleCommands}
            availableCommands={availableCommands}
            center={false}
          />
        </div>
  )

  async function focusOnInput() {
    await sleep(100);
    document.querySelector('input')?.focus()
  }

  

  
}

export default Terminal