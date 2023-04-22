import React, { cloneElement, useEffect, useRef } from 'react'
import Pong from './Pong'
import login from '../functions/login';
import rickroll from '../functions/rickroll';
import Card, { CardType } from '../components/Card';
import Terminal from './Terminal';
import Profile from '../widgets/Profile/Profile';
import MatrixRain from "../widgets/MatrixRain";
import Leaderboard from '../widgets/Leaderboard/Leaderboard';
import Chat from '../widgets/Chat/Chat';
import Less from '../widgets/Less';
import api from '../api/api';
import socketApi from '../api/socketApi';
import { UserData } from '../modal/UserData';
import { getMyProfile, getProfileOfUser } from '../functions/profile';
import YoutubeEmbed from '../components/YoutubeEmbed';
import { getFriendList } from '../functions/friendlist';
import { FriendData } from '../modal/FriendData';
import Friendlist from '../widgets/Friendlist/Friendlist';

const availableCommands = ["login", "sudo", "ls", "start", "add", "clear", "help", "whoami", "end", "less", "profile", "friends"];
const emptyWidget = <div></div>;
let currentPreviewProfile: UserData | null = null;
let myFriends: FriendData[] = [];

let myProfile: UserData = {
  accessToken: "hidden",
  avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  elo: 400,
  intraId: 130305,
  intraName: "wricky-t",
  tfaSecret: null,
  userName: "ricky"
};

myFriends = [
  {
    id: 1,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 2,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 3,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 4,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 5,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 6,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 7,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 8,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 9,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 10,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 11,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 12,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 13,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 14,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 15,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 16,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 17,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 18,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 19,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 20,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 21,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 22,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 23,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 24,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 25,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 26,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 27,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 28,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 29,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 30,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 31,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 32,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 33,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 34,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 35,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 36,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 37,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 38,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 39,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 40,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 41,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 42,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 43,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 44,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 45,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 46,
    senderIntraName: "wricky-t",
    receiverIntraName: "schuah",
    elo: 400,
    status: "ACCEPTED",
    userName: "sean",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 47,
    senderIntraName: "maliew",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "PENDING",
    userName: "matthew",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
  {
    id: 48,
    senderIntraName: "itan",
    receiverIntraName: "wricky-t",
    elo: 400,
    status: "BLOCKED",
    userName: "ijon",
    avatar: "https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP.jpg",
  },
]

function HomePage() {
  const [elements, setElements] = React.useState<JSX.Element[]>([])
  const [index, setIndex] = React.useState(0);
  const [startMatch, setStartMatch] = React.useState(false);
  const [topWidget, setTopWidget] = React.useState(<Profile userData={myProfile} />);
  const [midWidget, setMidWidget] = React.useState(<MatrixRain />);
  // const [midWidget, setMidWidget] = React.useState(<Leaderboard />);
  const [botWidget, setBotWidget] = React.useState(<Chat />);
  const [leftWidget, setLeftWidget] = React.useState<JSX.Element | null>(null);
  const [expandProfile, setExpandProfile] = React.useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketApi.connect();
    getMyProfile().then((profile) => {
      myProfile = profile.data as UserData;
      console.log(myProfile);
      setTopWidget(<Profile userData={myProfile} />);
    });
    // getFriendList().then((friends) => {
    //   myFriends = friends.data as FriendData[];
    //   console.log(myFriends);
    // });
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
      case "add":
        const newCard = card(index);
        newList = [newCard].concat(elements);
        setIndex(index + 1);
        break;
      case "cowsay":
        const newCowsay = <Card key={index} type={CardType.SUCCESS}>
          <p>
            {` _${new Array(command[1].length + 1).join("_")}_ `}<br />
            {`< ${command[1]} >`}<br />
            {` -${new Array(command[1].length + 1).join("-")}- `}<br />
            {"        \\   ^__^"}<br />
            {"         \\  (oo)\_______"}<br />
            {"            (__)\       )\\/\\"}<br />
            {"                ||----w |"}<br />
            {"                ||     ||"}
          </p>
        </Card>;
        newList = [newCowsay].concat(elements);
        setIndex(index + 1);
        break;
      case "profile":
        newList = handleProfileCommand(command);
        break;
      case "friends":

        break;
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
        setLeftWidget(<Friendlist userData={myProfile} friendsData={myFriends} onQuit={() => {
          setLeftWidget(null);
        }} />);
        // setLeftWidget(<Less onQuit={() => {
        //   setLeftWidget(null);
        // }} />);
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
    return <Card key={index} type={CardType.SUCCESS}>
      <p className='text-gray-300 text-2xl tracking-tighter mb-5 h-15'>This is a card</p>
    </Card>;
  }

  function helpCard() {
    return <Card key={index} type={CardType.SUCCESS}>
      <p >
        <span className=' text-2xl neonText-white font-bold'>HELP</span><br />
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
    return <Card key={index} type={CardType.ERROR}>
      <p >command does not exist...     get some help.</p>
    </Card>;
  }

  function handleProfileCommand(command: string[]): JSX.Element[] {
    let newList: JSX.Element[] = [];
    if (command.length === 2) {
      getProfileOfUser(command[1]).then((response) => {
        currentPreviewProfile = response.data;
        if (currentPreviewProfile as any === '') {
          const newErrorCard = <Card key={index}> <p>no such user</p></Card>;
          newList = [newErrorCard].concat(elements);
          setIndex(index + 1);
          setElements(newList);
          return newList;
        }
        newList = elements;
        const newProfileCard = <Profile userData={currentPreviewProfile as UserData} expanded={expandProfile} />;
        setTopWidget(newProfileCard);
        setTimeout(() => {
          setExpandProfile(true);
        }, 500);
      });
    } else {
      const newProfileCard = <Profile userData={myProfile} />;
      setTopWidget(newProfileCard);
    }
    return newList;
  }

  function handleFriendsCommand(command: string[]): JSX.Element[] {
    let newList: JSX.Element[] = [];
    if (command.length === 1) {

    } else if (command.length === 2) {

    } else if (command.length === 4) {
    }
    return newList;
  }
}

export default HomePage