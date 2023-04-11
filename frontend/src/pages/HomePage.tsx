import React from 'react'
import Pong from './Pong'
import login from '../functions/login';
import rickroll from '../functions/rickroll';
import Card from '../components/Card';
import Terminal from './Terminal';
import Profile from '../widgets/Profile';

const availableCommands = ["login", "sudo", "ls", "start", "add", "clear", "help", "whoami", "end"];
const emptyWidget = <div></div>;
function HomePage() {
  const [elements, setElements] = React.useState([] as JSX.Element[])
  const [index, setIndex] = React.useState(0);
  const [startMatch, setStartMatch] = React.useState(false);
  const [topWidget, setTopWidget] = React.useState(<Profile />);
  const [midWidget, setMidWidget] = React.useState(emptyWidget);
  const [botWidget, setBotWidget] = React.useState(emptyWidget);

  return (
    <div className='h-full p-7'>
      {startMatch && <Pong />}
      <div className=' h-full w-full bg-dimshadow border-4 border-highlight rounded-2xl overflow-hidden flex flex-row'>
        <Terminal availableCommands={availableCommands} handleCommands={handleCommands} elements={elements} />
        <div className=' bg-highlight h-full w-[7px]' />
        <div className='w-[1000px] flex flex-col overflow-hidden'>
          {topWidget}
          {midWidget}
          {botWidget}
        </div>
      </div>
    </div>
  )

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
      case "whoami":
        const newWhoamiCard = <Profile />;
        setTopWidget(newWhoamiCard);
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

export default HomePage