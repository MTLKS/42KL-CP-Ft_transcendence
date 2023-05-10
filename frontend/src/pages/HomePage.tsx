import React, { useState, useEffect, useRef, useMemo } from 'react'
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
import { ACTION_TYPE } from '../widgets/Friends/FriendAction/FriendActionCard';
import FriendAction from '../widgets/Friends/FriendAction/FriendAction';
import { FriendsContext, SelectedFriendContext } from '../contexts/FriendContext';
import UserContext from '../contexts/UserContext';
import { addFriend } from '../functions/friendactions';
import HelpCard from '../widgets/TerminalCards/HelpCard';
import { allCommands, friendCommands } from '../functions/commandOptions';
import { friendErrors } from '../functions/errorCodes';
import Leaderboard from '../widgets/Leaderboard/Leaderboard';
import { AppProvider } from '@pixi/react';
import Game from '../game/Game';
// import UserContext from '../context/UserContext';
import Tfa from '../components/tfa';
<<<<<<< Updated upstream
import UserForm from './UserForm/UserForm';
import { PolkaDotContainer } from '../components/Background';
import MouseCursor from '../components/MouseCursor';

const availableCommands = ["sudo", "start", "clear", "help", "end", "profile", "friend", "ok", "leaderboard", "cowsay", "set", "reset"];
const emptyWidget = <div></div>;
=======
import { gameTick } from '../main';
import previewProfileContext from '../contexts/PreviewProfileContext';
import { checkTFA } from '../functions/tfa';

const availableCommands = [
  "login",
  "sudo",
  "display",
  "start",
  "clear",
  "help",
  "end",
  "profile",
  "ok",
  "leaderboard",
  "cowsay",
  "friend",
  "set",
  "reset",
  "tfa"
];
>>>>>>> Stashed changes

interface HomePageProps {
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  userData: UserData;
}

function HomePage(props: HomePageProps) {
  const { setNewUser, setUserData, userData } = props;
  const [currentPreviewProfile, setCurrentPreviewProfile] = useState<UserData>(userData);
  const [elements, setElements] = useState<JSX.Element[]>([])
  const [index, setIndex] = useState(0);
  const [startMatch, setStartMatch] = useState(false);
  const [topWidget, setTopWidget] = useState(<Profile />);
  const [midWidget, setMidWidget] = useState(<MatrixRain />);
  const [botWidget, setBotWidget] = useState(<Chat />);
  const [leftWidget, setLeftWidget] = useState<JSX.Element | null>(null);
  const [expandProfile, setExpandProfile] = useState(false);
  // const [myProfile, setMyProfile] = useState<UserData>({} as UserData);
  const [myFriends, setMyFriends] = useState<FriendData[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<FriendData[]>([]);
  const friendshipSocket = useMemo(() => {
    return new SocketApi("friendship");
  }, [])

  let incomingRequests: FriendData[] = useMemo(
    () => myFriends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.senderIntraName !== currentPreviewProfile.intraName),
    [myFriends]
  );

  const pageRef = useRef<HTMLDivElement>(null);

  const initFriendshipSocket = () => {
    friendshipSocket.listen("friendshipRoom", (data: any) => {
      getFriendList().then((friends) => {
        const newFriendsData = friends.data as FriendData[];
        setMyFriends(newFriendsData);
      });
    })
  }

  useEffect(() => {
    initFriendshipSocket();

    getFriendList().then((friends) => {
      const newFriendsData = friends.data as FriendData[];
      setMyFriends(newFriendsData);
    });
  }, []);

  return (
    <UserContext.Provider value={{ myProfile: currentPreviewProfile, setMyProfile: setCurrentPreviewProfile }}>
      <FriendsContext.Provider value={{ friends: myFriends, setFriends: setMyFriends }}>
        <SelectedFriendContext.Provider value={{ friends: selectedFriends, setFriends: setSelectedFriends }}>
          <div className='h-full w-full p-7'>
            {startMatch && <Pong />}
            {incomingRequests.length !== 0 && <FriendRequestPopup total={incomingRequests.length} />}
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
        </SelectedFriendContext.Provider>
      </FriendsContext.Provider>
    </UserContext.Provider>
  )

  function handleCommands(command: string[]) {
    let newList: JSX.Element[] = [];
    switch (command[0]) {
      case "sudo":
        newList = appendNewCard(<YoutubeEmbed key={"rickroll" + index} />);
        break;
      // case "cowsay":
      //   newList = appendNewCard(<Cowsay index={index} commands={command.slice(1)} />);
      case "start":
        if (!startMatch)
          setStartMatch(true);
        break;
      case "end":
        if (startMatch)
          setStartMatch(false);
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
      case "friend":
        handleFriendCommand(command.slice(1));
        break;
      case "leaderboard":
        newList = elements;
        setMidWidget(<Leaderboard />);
        break;
      case "clear":
        newList = elements.filter((element) => element.type === YoutubeEmbed);
        setIndex(newList.length - 1);
        break;
      case "help":
        newList = appendNewCard(<HelpCard key={index} title="help" option='commands' usage='<command>' commandOptions={allCommands} />)
        break;
      case "ok":
        newList = appendNewCard(<Card key={index} type={CardType.SUCCESS}>{"OK👌"}</Card>);
        break;
      case "tfa":
        newList = [<Tfa key={index} commands={command} />].concat(elements);
        setIndex(index + 1);
        break;
      case "reset":
        handleResetCommand(command);
        break;
      default:
        newList = appendNewCard(commandNotFoundCard());
        break;
    }
    setElements(newList);
  }

  function appendNewCard(newCard: JSX.Element | JSX.Element[]) {
    const newList = ([] as JSX.Element[]).concat(newCard, elements);
    setIndex(index + 1);
    return newList;
  }

  function commandNotFoundCard() {
    return <Card key={index} type={CardType.ERROR}>
      <p>Command not found... Get some <b className='font-extrabold'>help</b>.</p>
    </Card>;
  }

  function handleProfileCommand(command: string[]): JSX.Element[] {
    let newList: JSX.Element[] = [];
    if (command.length === 2) {
      getProfileOfUser(command[1]).then((response) => {
        const newPreviewProfile = response.data as UserData;
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
      const newProfileCard = <Profile />
      setCurrentPreviewProfile(userData!);
      setTopWidget(newProfileCard);
    }
    return newList;
  }

  interface errorType {
    error: friendErrors;
    data: FriendData | UserData | string;
  }

  function generateErrorCards(errors: errorType[], action: string) {
    const newErrorCards: JSX.Element[] = [];
    let friend, friendName;

    if (errors.length > 0) {
      for (const errAttempt of errors) {
        let errIndex: number = 0;
        switch (errAttempt.error) {
          case friendErrors.USER_NOT_FOUND:
            newErrorCards.push(<Card key={(errAttempt.data as string) + errIndex + index}>
              <p>Looks like you're trying to {action} a ghost. User not found: <span className='bg-accRed font-extrabold text-sm text-highlight'>{errAttempt.data as string}</span></p>
            </Card>)
            break;
          case friendErrors.FRIENDSHIP_EXISTED:
            friend = (errAttempt.data as FriendData);
            friendName = friend.receiverIntraName === userData.intraName ? friend.senderIntraName : friend.receiverIntraName;
            newErrorCards.push(<Card key={friendName + errIndex + index}>
              <p>Friendship with <span className="bg-accRed font-extrabold">{friendName}</span> existed! Current relationship: <span className='bg-highlight text-dimshadow'>{friend.status}</span></p>
            </Card>)
            break;
          case friendErrors.INVALID_RELATIONSHIP:
            friend = (errAttempt.data as FriendData);
            friendName = friend.receiverIntraName === userData.intraName ? friend.senderIntraName : friend.receiverIntraName;
            newErrorCards.push(<Card key={friendName + errIndex + index}>
              <p>Unable to {action} <span className="bg-accRed font-extrabold">{friendName}</span>. Current relationship: <span className='bg-highlight text-dimshadow'>{friend.status}</span></p>
            </Card>)
            break;
          case friendErrors.INVALID_OPERATION_ON_STRANGER:
            newErrorCards.push(<Card key={(errAttempt.data as string) + errIndex + index}>
              <p>Unable to {action} <span className="bg-accRed font-extrabold">{errAttempt.data as string}</span>. You two are not friends.</p>
            </Card>)
        }
        errIndex++;
      }
    }
    return newErrorCards;
  }

  function sendFriendRequestNotification(intraName: string) {
    console.log(intraName);
    friendshipSocket.sendMessages("friendshipRoom", { intraName: intraName });
    friendshipSocket.listen("friendshipRoom", (data: any) => {
      console.log(data);
    })
  }

  async function addMultipleFriends(friendIntraNames: string[]) {

    const errors: errorType[] = [];
    const successes: string[] = [];
    let newCards: JSX.Element[] = [];

    // iterate through the names and attempt get their user data to add as friend
    for (const friendName of friendIntraNames) {
      // try get the user data
      const friendProfile = await getProfileOfUser(friendName);
      // if data is "", meaning user not found
      if (!friendProfile.data) {
        errors.push({ error: friendErrors.USER_NOT_FOUND, data: friendName as string });
        continue;
      }
      // try to add the user
      const result = await addFriend((friendProfile.data as UserData).intraName);
      // if the response has a "error" field meaning friendship existed, cannot send friend request again
      if (result.data.error) {
        errors.push({
          error: friendErrors.FRIENDSHIP_EXISTED,
          data: (myFriends.find((friend) => friend.receiverIntraName === friendName || friend.senderIntraName === friendName) as FriendData)
        });
      } else {
        successes.push(friendName);
      }
    }
    newCards = newCards.concat(generateErrorCards(errors, ACTION_TYPE.ADD));
    // create card for each success friend request sent
    if (successes.length > 0) {
      for (const successName of successes) {
        newCards.push(
          <Card key={`${successName}_added`} type={CardType.SUCCESS}>
            <p>We've sent your friendship request to <span className='bg-accGreen text-highlight font-extrabold text-sm'>{successName}</span>. Finger crossed!</p>
          </Card>
        )
        sendFriendRequestNotification(successName);
      }
      // update friend list if there's a successful attempt
      const updatedFriendList = await getFriendList();
      setMyFriends(updatedFriendList.data);
    }
    setElements(appendNewCard(newCards));
  }

  function userDataToFriendData(user: UserData): FriendData {
    const friend: FriendData = {
      id: user.intraId,
      senderIntraName: userData.intraName,
      receiverIntraName: user.intraName,
      elo: 0,
      status: "STRANGER",
      userName: user.userName,
      avatar: user.avatar,
    };
    return friend;
  }

  function checkIfFriendPresent(friends: FriendData[], friendIntraName: string) {
    for (const friend of friends) {
      if (friend.receiverIntraName === friendIntraName || friend.senderIntraName === friendIntraName) {
        return true;
      }
    }
    return false;
  }

  function belongsTotheDesireCategory(action: string, status: string) {
    if (action === ACTION_TYPE.BLOCK && (status === "ACCEPTED" || status === "PENDING")) return true;

    if (action === ACTION_TYPE.UNBLOCK && status === "BLOCKED") return true;

    if (action === ACTION_TYPE.UNFRIEND && (status === "ACCEPTED" || status === "BLOCKED" || status === "PENDING")) return true;

    return false;
  }

  async function performActionOnMultipleUsers(action: string, userIntraNames: string[]) {

    const newSelectedFriends: FriendData[] = [];
    const errors: errorType[] = [];
    let newCards: JSX.Element[] = [];

    // get all user data
    const userProfiles = await Promise.all(
      userIntraNames.map(intraName => getProfileOfUser(intraName))
    );

    // categorized user data
    const categorizedUsers = userProfiles.map((user, index) => {

      if (user.data as any === '') return userIntraNames[index];

      const userData: UserData = user.data as UserData;
      let relationshipType: string = checkIfFriendPresent(myFriends, userData.intraName) ? "FRIEND" : "STRANGER";
      return { user: userData, type: relationshipType };
    });

    for (const user of categorizedUsers) {
      if (typeof user === 'string') {
        errors.push({ error: friendErrors.USER_NOT_FOUND, data: user as string });
      } else if (typeof user === 'object' && user.type === "STRANGER") {
        if (action === ACTION_TYPE.BLOCK) {
          const fakeFriend = userDataToFriendData(user.user);
          newSelectedFriends.push(fakeFriend);
        } else {
          errors.push({ error: friendErrors.INVALID_OPERATION_ON_STRANGER, data: user.user.intraName });
        }
      } else if (typeof user === 'object' && user.type === "FRIEND") {
        const friend = myFriends.find(
          friend => friend.receiverIntraName === user.user.intraName || friend.senderIntraName === user.user.intraName
        );
        if (belongsTotheDesireCategory(action, friend!.status))
          newSelectedFriends.push(friend!)
        else
          errors.push({ error: friendErrors.INVALID_RELATIONSHIP, data: friend! as FriendData });
      }
    }

    newCards = newCards.concat(generateErrorCards(errors, action));
    setElements(appendNewCard(newCards));
    setSelectedFriends(newSelectedFriends);
    if (newSelectedFriends.length > 0)
      setLeftWidget(<FriendAction user={userData} useSelectedFriends={true} action={action} onQuit={() => setLeftWidget(null)} />);
  }

  async function handleFriendCommand(command: string[]) {

    let newList: JSX.Element[] = [];
    let recognizable: boolean = false;

    if (command.length === 0) {
      recognizable = true;
      newList = appendNewCard(
        <HelpCard title="friend" usage="friend <option>" option="options" commandOptions={friendCommands} key={index} />
      );
    }

    const updatedFriendlist = await getFriendList();
    setMyFriends(updatedFriendlist.data);

    if (command[0] === "list" && command.length === 1) {
      setLeftWidget(<Friendlist userData={userData} onQuit={() => setLeftWidget(null)} />);
      recognizable = true;
      newList = elements;
    }

    if (command[0] === "requests" && command.length === 1) {
      setLeftWidget(<FriendAction user={userData} action={ACTION_TYPE.ACCEPT} onQuit={() => setLeftWidget(null)} />);
      recognizable = true;
      newList = elements;
    }

    if (command[0] === "block" || command[0] === "unblock" || command[0] === "unfriend") {
      if (command.length === 1)
        setLeftWidget(<FriendAction user={userData} action={command[0]} onQuit={() => setLeftWidget(null)} />);
      else if (command.length >= 2) {
        performActionOnMultipleUsers(command[0], command.slice(1));
      }
      recognizable = true;
      newList = elements;
    }

    if (command[0] === "add" && command.length >= 2) {
      addMultipleFriends(command.slice(1));
      recognizable = true;
      newList = elements;
    }

    if (recognizable === false)
      newList = appendNewCard(<HelpCard title="friend" usage="friend <option>" option="options" commandOptions={friendCommands} key={index} />);
    setElements(newList);
  }
  
  function handleResetCommand(command: string[]) {
    checkTFA(command[1]).then((res) => {
      getMyProfile().then((profile) => {
        setNewUser(true);
        if (res.error === undefined && res.boolean === false)
          return setElements(appendNewCard(<Card key={"tfa" + index} type={CardType.ERROR}>Reset failed: Wrong OTP</Card>));
        setUserData(profile.data as UserData);
      });
    });
  }
}

export default HomePage