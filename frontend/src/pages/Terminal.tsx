import React from 'react'
import PromptField from '../PromptField/PromptField'
import SrcollView from '../components/SrcollView'
import Card from '../components/Card'
import login from '../functions/login'
import rickroll from '../functions/rickroll'

function Terminal() {
  const [elements, setElements] = React.useState([] as JSX.Element[])
  const [index, setIndex] = React.useState(0);


  return (
    <div className='h-screen flex flex-col'>
      <SrcollView>
        <div className=' flex justify-center'>
          <p className=' glitch text-gray-300 text-2xl tracking-tighter mb-5 h-15'>
            <span className='glitch-child1'>Welcome to PONGsh</span>
            Welcome to PONGsh
          </p>
        </div>
        {elements}
      </SrcollView>
      <PromptField handleCommands={(command) => {
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
          case "add":
            const newCard = card(index);
            const newList = elements.concat(newCard);
            setIndex(index + 1);
            setElements(newList);
            break;
          case "clear":
            setIndex(0);
            setElements([]);
            break;
          case "help":
            const newHelpCard = helpCard();
            const newHelpList = elements.concat(newHelpCard);
            setIndex(index + 1);
            setElements(newHelpList);
            break;
          default:
            break;
        }
      }} />
    </div>
  )

  function card(index: number) {
    return <Card key={index}>
      <p className='text-gray-300 text-2xl tracking-tighter mb-5 h-15'>This is a card</p>
    </Card>;
  }

  function helpCard() {
    return <Card key={index}>
      <p className='text-gray-300 text-1xl tracking-tighter mb-5 h-15 whitespace-pre'>
        <span className=' text-2xl text-green-600 font-bold'>Get some help!</span><br />
        add:         add a card <br />
        clear:       clear the screen <br />
        cowsay:      make a cow say something <br />
        help:        show this help message <br />
        leaderboard: show the leaderboard <br />
        login:       login to your account <br />
        ls:          list files <br />
        ok:          ok <br />
        sudo:        give you admin privilige <br />
      </p>
    </Card>;
  }
}

export default Terminal