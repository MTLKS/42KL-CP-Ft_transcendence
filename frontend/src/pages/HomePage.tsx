import React, { cloneElement, useEffect, useRef } from 'react'
import Pong from './Pong'
import login from '../functions/login';
import rickroll from '../functions/rickroll';
import Card from '../components/Card';
import Terminal from './Terminal';
import Profile from '../widgets/Profile/Profile';
import MatrixRain from "../widgets/MatrixRain";
import Leaderboard from '../widgets/Leaderboard/Leaderboard';
import Chat from '../widgets/Chat/Chat';




function A() {
  const [height, setHeight] = React.useState(0);

  useEffect(() => {
    let a = height;
    const interval = setInterval(() => {
      a -= 10;
      setHeight(a);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-red-500 transition-all"
      style={{ height: height }}
    ></div>
  )
}
function B() {
  return (
    <div className="bg-green-500 flex-1"></div>
  )
}
function C() {
  return (
    <div className="bg-blue-500 flex flex-col">
      <div className='h-20'></div>
      <div className='h-10'></div>
    </div>
  )
}


const availableCommands = ["login", "sudo", "ls", "start", "add", "clear", "help", "whoami", "end"];
const emptyWidget = <div></div>;
function HomePage() {
  const [elements, setElements] = React.useState([] as JSX.Element[])
  const [index, setIndex] = React.useState(0);
  const [startMatch, setStartMatch] = React.useState(false);
  const [width, setWidth] = React.useState("60%");
  const [topWidget, setTopWidget] = React.useState(<Profile />);
  const [draggable, setDraggable] = React.useState(false);
  const [midWidget, setMidWidget] = React.useState(<Leaderboard />);
  // const [midWidget, setMidWidget] = React.useState(<Leaderboard />);
  const [botWidget, setBotWidget] = React.useState(<Chat />);

  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div className='h-full w-full p-7'>
      {startMatch && <Pong />}
      <div className=' h-full w-full bg-dimshadow border-4 border-highlight rounded-2xl flex flex-row overflow-hidden'
        ref={pageRef}
        onMouseMove={(e) => {
          if (!draggable) return;
          const pageWidth = pageRef.current?.clientWidth!;
          const padding = (window.innerWidth - pageWidth) / 2;
          if (pageWidth - e.screenX + padding < 500) return;
          if (e.screenX && e.screenX - padding >= 0)
            setWidth(`${((e.screenX - padding) / pageWidth) * 100}%`);
          setTopWidget(<Profile animate={draggable} />);

        }}
        onMouseUp={(e) => {
          if (!draggable) return;
          const pageWidth = pageRef.current?.clientWidth!;
          const padding = (window.innerWidth - pageWidth) / 2;
          if (pageWidth - e.screenX + padding < 500) return;
          if (e.screenX - padding >= 0)
            setWidth(`${((e.screenX - padding) / pageWidth) * 100}%`);
          setDraggable(false);
          setTopWidget(<Profile animate={draggable} />);
        }}
      >
        <Terminal availableCommands={availableCommands} handleCommands={handleCommands} elements={elements}
          style={{ width: width }}
        />
        <div className=' bg-highlight h-full w-1'
          style={{ cursor: 'col-resize' }}
          onMouseDown={(e) => {
            setDraggable(true);
            setTopWidget(<Profile animate={draggable} />);
            // const crt = document.createElement('div');
            // crt.style.opacity = '0';
            // crt.style.width = '0px';
            // crt.style.height = '0px';
            // pageRef.current?.clientWidth;
            // e.dataTransfer.setDragImage(crt, 0, 0);

          }}


        />
        <div className=' h-full flex-1 flex flex-col pointer-events-auto'
          onMouseUp={(e) => {
            if (!draggable) return;
            const pageWidth = pageRef.current?.clientWidth!;
            const padding = (window.innerWidth - pageWidth) / 2;
            if (pageWidth - e.screenX + padding < 500) return;
            if (e.screenX - padding >= 0)
              setWidth(`${((e.screenX - padding) / pageWidth) * 100}%`);
            setDraggable(false);
            setTopWidget(<Profile animate={draggable} />);
          }}
        >
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