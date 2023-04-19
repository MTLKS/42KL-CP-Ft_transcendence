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
import Less from '../widgets/Less';
import api from '../api/api';
import { UserData } from '../modal/UserData';
import { getMyProfile } from '../functions/profile';
import YoutubeEmbed from '../components/YoutubeEmbed';

const availableCommands = ["login", "sudo", "ls", "start", "add", "clear", "help", "whoami", "end", "less"];
const emptyWidget = <div></div>;

let myProfile: UserData = {
  accessToken: "hidden",
  avatar: "4.png",
  elo: 400,
  intraId: 130305,
  intraName: "itan",
  tfaSecret: null,
  userName: "Ijon"
};

function HomePage() {
  const [elements, setElements] = React.useState<JSX.Element[]>([])
  const [index, setIndex] = React.useState(0);
  const [startMatch, setStartMatch] = React.useState(false);
  const [topWidget, setTopWidget] = React.useState(<Profile userData={myProfile} />);
  const [midWidget, setMidWidget] = React.useState(<MatrixRain />);
  // const [midWidget, setMidWidget] = React.useState(<Leaderboard />);
  const [botWidget, setBotWidget] = React.useState(<Chat />);
  const [leftWidget, setLeftWidget] = React.useState<JSX.Element | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMyProfile().then((profile) => {
      myProfile = profile.data;
      console.log(myProfile);
      setTopWidget(<Profile userData={myProfile} />);
    });
  }, []);

  return (
    <div className='h-full w-full p-7'>
      {startMatch && <Pong />}
      <div className=' h-full w-full bg-dimshadow border-4 border-highlight rounded-2xl flex flex-row overflow-hidden'
        ref={pageRef}
      >
        <div className='h-full flex-1'>
          {leftWidget ? leftWidget : <Terminal availableCommands={availableCommands} handleCommands={handleCommands} elements={elements} />}
        </div>
        <div className=' bg-highlight h-full w-1' />
        <div className=' h-full w-[700px] flex flex-col pointer-events-auto'>
          {topWidget}
          {midWidget}
          {botWidget}
        </div>
      </div>
    </div>
  )

  function handleCommands(command: string[]) {
    let newList: JSX.Element[] = [];
    switch (command[0]) {
      case "login":
        login();
        break;
      case "sudo":
        const newEmbed = <YoutubeEmbed key={"rickroll" + index} />
        newList = [newEmbed].concat(elements);
        setIndex(index + 1);
        // rickroll();
        break;
      // case "ls":
      //   rickroll();
      //   break;
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
      // case "add":
      //   const newCard = card(index);
      //   newList = [newCard].concat(elements);
      //   setIndex(index + 1);
      //   break;
      case "clear":
        newList = elements.filter((element) => element.type === YoutubeEmbed);
        setIndex(newList.length - 1);
        break;
      case "help":
        const newHelpCard = helpCard();
        newList = [newHelpCard].concat(elements);
        setIndex(index + 1);
        break;
      case "whoami":
        const newWhoamiCard = <Profile userData={myProfile} />;
        setTopWidget(newWhoamiCard);
        break;
      case "less":
        setLeftWidget(<Less onQuit={() => {
          setLeftWidget(null);
        }} />);
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
    return <Card key={index} type=''>
      <p className='text-gray-300 text-2xl tracking-tighter mb-5 h-15'>This is a card</p>
    </Card>;
  }

  function helpCard() {
    return <Card key={index} type=''>
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
    return <Card key={index} type=''>
      <p className='text-xl neonText-red whitespace-pre'>command does not exist...     get some help.</p>
    </Card>;
  }
}

export default HomePage