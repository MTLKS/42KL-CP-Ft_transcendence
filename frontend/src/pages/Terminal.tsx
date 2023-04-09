import React from 'react'
import PromptField from '../PromptField/PromptField'
import SrcollView from '../components/SrcollView'
import Card from '../components/Card'
import login from '../functions/login'
import rickroll from '../functions/rickroll'
import Pong from './Pong'
import sleep from '../functions/sleep'

const availableCommands = ["login", "sudo", "ls", "start", "add", "clear", "help"];

function Terminal() {
  const [elements, setElements] = React.useState([] as JSX.Element[])
  const [index, setIndex] = React.useState(0);
  const [startMatch, setStartMatch] = React.useState(false);

  focusOnInput();
  return (
    <div>
      {startMatch && <Pong />}
      <div className='h-screen flex flex-col'>
        <SrcollView>
          {elements}
          <div className=' flex justify-center'>
            <p className=' glitch text-gray-300 text-8xl tracking-tighter mt-10 mb-5 h-15'>
              <span className='glitch-child1'>Welcome to PONGsh</span>
              Welcome to PONGsh
            </p>
          </div>
        </SrcollView>
        <PromptField
          handleCommands={handleCommands}
          availableCommands={availableCommands}
          center={false}
        />
      </div>
    </div>
  )

  async function focusOnInput() {
    await sleep(100);
    document.querySelector('input')?.focus()
  }

  function handleCommands(command: string) {
    let newList: JSX.Element[] = [];
    switch (command) {
      case "login":
        login();
        break;
      case "sudo":
        rickroll();
        break;
      case "ls":
        rickroll();
        break;
      case "start":
        if (!startMatch) {
          setStartMatch(true);
        }
        break;
      case "end":
        if (startMatch) {
          setStartMatch(false);
        }
        break;
      case "add":
        const newCard = card(index);
        newList = [newCard].concat(elements);
        setIndex(index + 1);
        break;
      case "clear":
        setIndex(0);
        break;
      case "help":
        const newHelpCard = helpCard();
        newList = [newHelpCard].concat(elements);
        setIndex(index + 1);
        break;
      default:
        const newErrorCard = errorCard();
        newList = [newErrorCard].concat(elements);
        setIndex(index + 1);
        break;
    }
    setElements(newList);
  }

  function card(index: number) {
    return <Card key={index}>
      <p className='text-gray-300 text-2xl tracking-tighter mb-5 h-15'>This is a card</p>
    </Card>;
  }

  function helpCard() {
    return <Card key={index}>
      <p className='text-gray-300 text-1xl tracking-tighter mb-5 h-15 whitespace-pre'>
        <span className=' text-2xl neonText-white font-bold'>Get some help!</span><br />
        <span className=' text-2xl neonText-cyan font-bold'>Get some help!</span><br />
        <span className=' text-2xl neonText-pink font-bold'>Get some help!</span><br />
        <span className=' text-2xl neonText-yellow font-bold'>Get some help!</span><br />
        <span className=' text-2xl neonText-red font-bold'>Get some help!</span><br />
        <span className=' text-2xl neonText-green font-bold'>Get some help!</span><br />
        <span className=' text-2xl neonText-blue font-bold'>Get some help!</span><br />
        add:         add a card <br />
        clear:       clear the screen <br />
        cowsay:      make a cow say something <br />
        help:        show this help message <br />
        leaderboard: show the leaderboard <br />
        login:       login to your account <br />
        exit:        logout from your account <br />
        ls:          list files <br />
        ok:          ok <br />
        sudo:        give you admin privilige <br />
      </p>
    </Card>;
  }

  function errorCard() {
    return <Card key={index}>
      <p className='text-xl neonText-red whitespace-pre'>command does not exist...     get some help.</p>
    </Card>;
  }
}

export default Terminal