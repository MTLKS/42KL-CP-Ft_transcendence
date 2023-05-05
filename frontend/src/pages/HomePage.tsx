import React, { useState, useEffect, useRef } from 'react'
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
import { FriendActionContext, FriendsContext, SelectedFriendContext } from '../contexts/FriendContext';
import UserContext from '../contexts/UserContext';
import { addFriend, deleteFriendship } from '../functions/friendactions';
import { AxiosResponse } from 'axios';
import HelpCard from '../widgets/TerminalCards/HelpCard';
import { allCommands, friendCommands } from '../functions/commandOptions';
import { friendErrors } from '../functions/errorCodes';
import Leaderboard from '../widgets/Leaderboard/Leaderboard';

const availableCommands = ["sudo", "start", "clear", "help", "end", "profile", "friend", "ok", "leaderboard", "cowsay"];
const emptyWidget = <div></div>;
let currentPreviewProfile: UserData | null = null;

function HomePage() {
  const [elements, setElements] = useState<JSX.Element[]>([])
  const [index, setIndex] = useState(0);
  const [startMatch, setStartMatch] = useState(false);
  const [topWidget, setTopWidget] = useState(<Profile />);
  const [midWidget, setMidWidget] = useState(<MatrixRain />);
  const [botWidget, setBotWidget] = useState(<Chat />);
  const [leftWidget, setLeftWidget] = useState<JSX.Element | null>(null);
  const [expandProfile, setExpandProfile] = useState(false);
  const [myProfile, setMyProfile] = useState<UserData>({} as UserData);
  const [myFriends, setMyFriends] = useState<FriendData[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<FriendData[]>([]);
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
    incomingRequests = myFriends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.senderIntraName !== myProfile.intraName);
    setFriendRequests(incomingRequests.length);
  }, [myFriends]);

  useEffect(() => {
    getMyProfile().then((profile) => {
      setMyProfile(profile.data as UserData);
    });

    initFriendshipSocket();

    getFriendList().then((friends) => {
      const newFriendsData = friends.data as FriendData[];
      setMyFriends(newFriendsData);
    });
  }, []);

  return (
    <UserContext.Provider value={{ myProfile, setMyProfile }}>
      <FriendsContext.Provider value={{ friends: myFriends, setFriends: setMyFriends }}>
        <SelectedFriendContext.Provider value={{ friends: selectedFriends, setFriends: setSelectedFriends }}>
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
      case "start":
        if (!startMatch) setStartMatch(true);
        break;
      case "end":
        if (startMatch) setStartMatch(false);
        break;
      case "cowsay":
        newList = appendNewCard(<Cowsay index={index} commands={command.slice(1)} />);
        break;
      case "profile":
        newList = handleProfileCommand(command);
        break;
      case "friend":
        newList = handleFriendCommand(command.slice(1));
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
        currentPreviewProfile = response.data as UserData;
        if (currentPreviewProfile as any === '') {
          const newErrorCard = <Card key={index}> <p>no such user</p></Card>;
          newList = [newErrorCard].concat(elements);
          setIndex(index + 1);
          setElements(newList);
          return newList;
        }
        newList = elements;
        const newProfileCard = <Profile expanded={expandProfile} />;
        setTopWidget(newProfileCard);
        setTimeout(() => {
          setExpandProfile(true);
        }, 500);
      });
    } else {
      const newProfileCard = <Profile />
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
            friendName = friend.receiverIntraName === myProfile.intraName ? friend.senderIntraName : friend.receiverIntraName;
            newErrorCards.push(<Card key={friendName + errIndex + index}>
              <p>Friendship with <span className="bg-accRed font-extrabold">{friendName}</span> existed! Current relationship: <span className='bg-highlight text-dimshadow'>{friend.status}</span></p>
            </Card>)
            break;
          case friendErrors.INVALID_RELATIONSHIP:
            friend = (errAttempt.data as FriendData);
            friendName = friend.receiverIntraName === myProfile.intraName ? friend.senderIntraName : friend.receiverIntraName;
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
      senderIntraName: myProfile.intraName,
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

  /**
     * BLOCK: ACCEPTED, PENDING
     * UNBLOCK: those BLOCKED
     * UNFRIEND: those ACCEPTED & BLOCKED
     */
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
        errors.push({ error: friendErrors.USER_NOT_FOUND, data: user as string});
      } else if (typeof user === 'object' && user.type === "STRANGER") {
        if (action === ACTION_TYPE.BLOCK) {
          const fakeFriend = userDataToFriendData(user.user);
          newSelectedFriends.push(fakeFriend);
        } else {
          errors.push({ error: friendErrors.INVALID_OPERATION_ON_STRANGER, data: user.user.intraName});
        }
      } else if (typeof user === 'object' && user.type === "FRIEND") {
        const friend = myFriends.find(
          friend => friend.receiverIntraName === user.user.intraName || friend.senderIntraName === user.user.intraName
        );
        if (belongsTotheDesireCategory(action, friend!.status))
          newSelectedFriends.push(friend!)
        else
          errors.push({ error: friendErrors.INVALID_RELATIONSHIP, data: friend! as FriendData});
      }
    }
    
    newCards = newCards.concat(generateErrorCards(errors, action));
    setElements(appendNewCard(newCards));
    setSelectedFriends(newSelectedFriends);
    setLeftWidget(<FriendAction user={myProfile} useSelectedFriends={true} action={action} onQuit={() => setLeftWidget(null)} />);
  }

  function handleFriendCommand(command: string[]) {

    if (command.length === 0) {
      return appendNewCard(
        <HelpCard title="friend" usage="friend <option>" option="options" commandOptions={friendCommands} key={index} />
      );
    }

    if (command[0] === "list" && command.length === 1) {
      setLeftWidget(<Friendlist userData={myProfile} onQuit={() => setLeftWidget(null)} />);
      return elements;
    }

    if (command[0] === "requests" && command.length === 1) {
      setLeftWidget(<FriendAction user={myProfile} action={ACTION_TYPE.ACCEPT} onQuit={() => setLeftWidget(null)} />);
      return elements;
    }

    if (command[0] === "block" || command[0] === "unblock" || command[0] === "unfriend") {
      if (command.length === 1)
        setLeftWidget(<FriendAction user={myProfile} action={command[0]} onQuit={() => setLeftWidget(null)} />);
      else if (command.length >= 2) {
        performActionOnMultipleUsers(command[0], command.slice(1));
      }
      return elements;
    }

    if (command[0] === "add" && command.length >= 2) {
      addMultipleFriends(command.slice(1));
      return elements;
    }
    return appendNewCard(<HelpCard title="friend" usage="friend <option>" option="options" commandOptions={friendCommands} key={index} />);
  }
}

export default HomePage