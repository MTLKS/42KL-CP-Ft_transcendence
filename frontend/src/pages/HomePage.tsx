import React, { useEffect, useRef, useState } from 'react'
import Pong from './Pong'
import Card, { CardType } from '../components/Card';
import Terminal from './Terminal';
import Profile from '../widgets/Profile/Profile';
import MatrixRain from "../widgets/MatrixRain";
import Chat from '../widgets/Chat/Chat';
import { UserData } from '../modal/UserData';
import { getMyProfile, getProfileOfUser } from '../functions/profile';
import YoutubeEmbed from '../components/YoutubeEmbed';
import { getFriendList } from '../functions/friendlist';
import { FriendData } from '../modal/FriendData';
import Friendlist from '../widgets/Friends/Friendlist/Friendlist';
import FriendRequestPopup from '../widgets/Friends/FriendRequest/FriendRequestPopup';
import SocketApi from '../api/socketApi';
import Cowsay from '../widgets/TerminalCards/Cowsay';
import FriendActionCard, { ACTION_TYPE } from '../widgets/Friends/FriendAction/FriendActionCard';
import FriendAction from '../widgets/Friends/FriendAction/FriendAction';
import { FriendsContext } from '../contexts/FriendContext';

const availableCommands = ["sudo", "start", "add", "clear", "help", "whoami", "end", "profile", "friend"];
const emptyWidget = <div></div>;
let currentPreviewProfile: UserData | null = null;

let myProfile: UserData = {
  accessToken: "hidden",
  avatar: "",
  elo: 400,
  intraId: 130305,
  intraName: "wricky-t",
  tfaSecret: null,
  userName: "JOHNDOE"
};

function HomePage() {
  const [elements, setElements] = useState<JSX.Element[]>([])
  const [index, setIndex] = useState(0);
  const [startMatch, setStartMatch] = useState(false);
  const [topWidget, setTopWidget] = useState(<Profile userData={myProfile} />);
  const [midWidget, setMidWidget] = useState(<MatrixRain />);
  const [botWidget, setBotWidget] = useState(<Chat />);
  const [leftWidget, setLeftWidget] = useState<JSX.Element | null>(null);
  const [expandProfile, setExpandProfile] = useState(false);
  const [myFriends, setMyFriends] = useState<FriendData[]>([]);
  const [friendRequests, setFriendRequests] = useState(0);

  const pageRef = useRef<HTMLDivElement>(null);

  let incomingRequests: FriendData[] = myFriends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.senderIntraName != myProfile.intraName);

  const friendshipSocket = new SocketApi("friendship");

  const initFriendshipSocket = () => {
    friendshipSocket.listen("friendshipRoom", (data: any) => {
      getFriendList().then((friends) => {
        const newFriendsData = friends.data as FriendData[];
        setMyFriends(newFriendsData);
      });
    })

    // function addToFriendRoom(intraName: string) {
    //   console.log(intraName);
    //   friendshipSocket.sendMessages("friendshipRoom", {intraName: intraName});
    //   friendshipSocket.listen("friendshipRoom", (data: any) => {
    //     console.log(data);
    //   })
    // }

    // await api.post("/friendship", {receiverIntraName: "itan", status: "PENDING"})
    //         .then((data: any) =>  {addToFriendRoom(data.data.receiverIntraName)})
    //         .catch((err) => console.log(err));

    // await api.post("/friendship", {receiverIntraName: "schuah", status: "PENDING"})
    //         .then((data: any) =>  {addToFriendRoom(data.data.receiverIntraName)})
    //         .catch((err) => console.log(err));
  }

  useEffect(() => {
    incomingRequests = myFriends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.senderIntraName != myProfile.intraName);
    setFriendRequests(incomingRequests.length);
  }, [myFriends]);

  useEffect(() => {
    getMyProfile().then((profile) => {
      myProfile = profile.data as UserData;
      setTopWidget(<Profile userData={myProfile} />);
    });

    initFriendshipSocket();

    getFriendList().then((friends) => {
      const newFriendsData = friends.data as FriendData[];
      setMyFriends(newFriendsData);
    });
  }, []);

  return (
    <FriendsContext.Provider value={{ friends: myFriends, setFriends: setMyFriends }}>
      <div className='h-full w-full p-7'>
        {startMatch && <Pong />}
        {friendRequests !== 0 && <FriendRequestPopup total={friendRequests} />}
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
    </FriendsContext.Provider>
  )

  function handleCommands(command: string[]) {
    let newList: JSX.Element[] = [];
    switch (command[0]) {
      case "sudo":
        const newEmbed = <YoutubeEmbed key={"rickroll" + index} />
        newList = [newEmbed].concat(elements);
        setIndex(index + 1);
        break;
      case "start":
        if (!startMatch) setStartMatch(true);
        break;
      case "end":
        if (startMatch) setStartMatch(false);
        break;
      case "add":
        const newCard = card(index);
        newList = [newCard].concat(elements);
        setIndex(index + 1);
        break;
      case "cowsay":
        const newCowsay = <Cowsay index={index} commands={command.slice(1)}/>
        newList = [newCowsay].concat(elements);
        setIndex(index + 1);
        break;
      case "profile":
        newList = handleProfileCommand(command);
        break;
      case "friend":
        handleFriendCommand(command.slice(1));
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
      default:
        const newErrorCard = errorCard();
        newList = [newErrorCard].concat(elements);
        setIndex(index + 1);
        break;
    }
    setElements(newList);
  }

  function card(index: number) {
    // return <Card key={index} type={CardType.SUCCESS}>
    //   <p className='text-gray-300 text-2xl tracking-tighter mb-5 h-15'>This is a card</p>
    // </Card>;
    return <></>
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
        sudo:        give you admin privilege <br />
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

  function handleFriendCommand(command: string[]) {
    if (command.length === 0) {
      console.log("show help");
      return;
    }

    if (command[0] === "list" && command.length === 1) {
      setLeftWidget(<Friendlist userData={myProfile} onQuit={() => setLeftWidget(null)} />);
      return;
    }

    if (command[0] === "requests" && command.length === 1) {
      setLeftWidget(<FriendAction user={myProfile} action={ACTION_TYPE.ACCEPT} onQuit={() => setLeftWidget(null)} />);
      return;
    }

    if (command[0] === "block") {
      // pass in all filtered friends
      if (command.length === 1)
        setLeftWidget(<FriendAction user={myProfile} action={ACTION_TYPE.BLOCK} onQuit={() => setLeftWidget(null)} />);
    }

    if (command[0] === "unblock") {
      // show all blocked friend
      if (command.length === 1)
        setLeftWidget(<FriendAction user={myProfile} action={ACTION_TYPE.UNBLOCK} onQuit={() => setLeftWidget(null)} />);
    }

    if (command[0] === "unfriend") {
      if (command.length === 1)
        setLeftWidget(<FriendAction user={myProfile} action={ACTION_TYPE.UNFRIEND} onQuit={() => setLeftWidget(null)} />)
    }

    if (command[0] === "add" && command.length >= 2) {
      // add friend
    }
  }
}

export default HomePage