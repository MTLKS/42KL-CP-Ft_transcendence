import React, { cloneElement, useContext, useEffect, useRef } from 'react'
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
import { UserData } from '../modal/UserData';
import { getMyProfile, getProfileOfUser } from '../functions/profile';
import YoutubeEmbed from '../components/YoutubeEmbed';
import { getFriendList } from '../functions/friendlist';
import { FriendData, FriendRequestType } from '../modal/FriendData';
import Friendlist from '../widgets/Friendlist/Friendlist';
import FriendRequest from '../widgets/FriendRequest';
import SocketApi from '../api/socketApi';
import { AppProvider } from '@pixi/react';
import Game from '../game/Game';
import UserContext from '../context/UserContext';
import Tfa from '../components/tfa';
import UserForm from './UserForm/UserForm';
import { PolkaDotContainer } from '../components/Background';
import MouseCursor from '../components/MouseCursor';

const availableCommands = ["login", "sudo", "ls", "start", "add", "clear", "help", "whoami", "end", "less", "profile", "friends", "set", "reset"];
const emptyWidget = <div></div>;
let myProfile: UserData | null = null;

interface HomePageProps {
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

function HomePage(props: HomePageProps) {
  const { setNewUser, setUserData } = props;
  const [currentPreviewProfile, setCurrentPreviewProfile] = React.useState<UserData>({} as UserData);
  const [elements, setElements] = React.useState<JSX.Element[]>([])
  const [index, setIndex] = React.useState(0);
  const [startMatch, setStartMatch] = React.useState(false);
  const [topWidget, setTopWidget] = React.useState(<Profile />);
  const [midWidget, setMidWidget] = React.useState(<MatrixRain />);
  const [botWidget, setBotWidget] = React.useState(<Chat />);
  const [leftWidget, setLeftWidget] = React.useState<JSX.Element | null>(null);
  const [expandProfile, setExpandProfile] = React.useState(true);
  const [myFriends, setMyFriends] = React.useState<FriendData[]>([]);
  const [friendRequests, setFriendRequests] = React.useState(0);

  let friendshipSocket: SocketApi;

  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    friendshipSocket = new SocketApi("friendship");
  }, []);
  const initFriendshipSocket = () => {
    friendshipSocket.listen("friendshipRoom", (data: any) => {
      getFriendList().then((friends) => {
        const newFriendsData = friends.data as FriendData[];
        setMyFriends(newFriendsData);
      });
    })
  }

  useEffect(() => {
    const totalFriendRequests = myFriends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.senderIntraName != currentPreviewProfile?.intraName).length;
    setFriendRequests(totalFriendRequests);
  }, [myFriends]);

  useEffect(() => {
    getMyProfile().then((profile) => {
      myProfile = profile.data as UserData;
      setCurrentPreviewProfile(profile.data as UserData);
    });

    initFriendshipSocket();

    getFriendList().then((friends) => {
      const newFriendsData = friends.data as FriendData[];
      setMyFriends(newFriendsData);
    });
  }, []);

  return (
    <UserContext.Provider value={{ myProfile: currentPreviewProfile, setMyProfile: setCurrentPreviewProfile }}>
      <div className='h-full w-full p-7'>
        {friendRequests !== 0 && <FriendRequest total={friendRequests} />}
        <div className=' h-full w-full bg-dimshadow border-4 border-highlight rounded-2xl flex flex-row overflow-hidden'
          ref={pageRef}
        >
          <div className='h-full flex-1'>
            {leftWidget ? leftWidget : <Terminal availableCommands={availableCommands} handleCommands={handleCommands} elements={elements} startMatch={startMatch} />}
          </div>
          <div className=' bg-highlight h-full w-1' />
          <div className=' h-full w-[700px] flex flex-col pointer-events-auto'>
            {topWidget}
            {midWidget}
            {botWidget}
          </div>
        </div>
      </div>
    </UserContext.Provider>
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
        break;
      case "start":
        if (!startMatch)
          setStartMatch(true);
        break;
      case "end":
        if (startMatch)
          setStartMatch(false);
        break;
      case "add":
        const newCard = card(index);
        newList = [newCard].concat(elements);
        setIndex(index + 1);
        break;
      case "cowsay":
        let say = "";
        for (let word of command.slice(1)) {
          say += word + " ";
        }
        const newCowsay = <Card key={index} type={CardType.SUCCESS}>
          <p>
            {` _${new Array(say.length).join("_")}_ `}<br />
            {`< ${say}>`}<br />
            {` -${new Array(say.length).join("-")}- `}<br />
            {"        \\   ^__^"}<br />
            {"         \\  (oo)\________"}<br />
            {"            (__)\        )\\/\\"}<br />
            {"               ||-----w|"}<br />
            {"               ||     ||"}
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
        const newWhoamiCard = <Profile />
        setTopWidget(newWhoamiCard);
        break;
      case "less":
        setLeftWidget(<Friendlist userData={currentPreviewProfile} friendsData={myFriends} onQuit={() => {
          setLeftWidget(null);
        }} />);
        break;
      case "tfa":
        newList = [<Tfa key={index} commands={command} />].concat(elements);
        setIndex(index + 1);
        break;
      case "reset":
        getMyProfile().then((profile) => {
          setNewUser(true);
          setUserData(profile.data as UserData);
        });
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
        add:          add a card <br />
        clear:        clear the screen <br />
        cowsay:       make a cow say something <br />
        help:         show this help message <br />
        leaderboard:  show the leaderboard <br />
        login:        login to your account <br />
        tfa:          set and unset Google TFA <br />
        sudo:         give you admin privilige <br />
        reset:        reset your profile picture and username <br />
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
        const newPreviewProfile = response.data;
        if (newPreviewProfile as any === '') {
          const newErrorCard = <Card key={index}> <p>no such user</p></Card>;
          newList = [newErrorCard].concat(elements);
          setIndex(index + 1);
          setElements(newList);
          return newList;
        }
        newList = elements;
        const newProfileCard = <Profile expanded={expandProfile} />;
        setTopWidget(newProfileCard);
        setCurrentPreviewProfile(newPreviewProfile);
        setTimeout(() => {
          setExpandProfile(true);
        }, 500);
      });
    } else {
      const newProfileCard = <Profile/>
      setCurrentPreviewProfile(myProfile!);
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