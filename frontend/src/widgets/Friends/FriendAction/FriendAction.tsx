import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import FriendActionCard, { ACTION_TYPE } from './FriendActionCard'
import LessFileIndicator from '../../Less/LessFileIndicator'
import { FriendData } from '../../../modal/FriendData'
import { UserData } from '../../../modal/UserData'
import { ActionCardsContext, ActionFunctionsContext, FriendActionContext, FriendsContext } from '../../../contexts/FriendContext'
import { acceptFriend, addFriend, blockExistingFriend, blockStranger, deleteFriendship } from '../../../functions/friendactions'
import { AxiosResponse } from 'axios'
import { getFriendList } from '../../../functions/friendlist'

interface FriendActionProps {
  user: UserData;
  action: string;
  selectedFriends?: FriendData[];
  onQuit: () => void;
}

function getFileName(action: string) {
  switch (action) {
    case ACTION_TYPE.ACCEPT:
      return "requests";
    default:
      return action;
  }
}

function FriendAction(props: FriendActionProps) {

  // props
  const { user, action, selectedFriends, onQuit } = props;
  const fileString = `./usr/${user.userName}/friend/${getFileName(action)} `;
  
  // hooks
  const { friends } = useContext(FriendsContext);
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [commandNotFound, setCommandNotFound] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputStyle, setOutputStyle] = useState("bg-accRed");
  const [outputStr, setOutputStr] = useState("");
  const { setFriends } = useContext(FriendsContext);
  const inputRef = useRef<HTMLInputElement>(null);
  
  let actionCards: JSX.Element[] =[];
  let yesAction: (name: string) => Promise<AxiosResponse>;
  let noAction: (name:string) => Promise<AxiosResponse>;

  const filteredFriends: FriendData[] = selectedFriends !== undefined ? selectedFriends : filterFriends();
  createFriendActionCards();
  setActionFunctions();

  useEffect(() => {
    focusOnInput();
    setActionFunctions();
  }, []);

  return (
    <FriendActionContext.Provider value={action}>
      <ActionCardsContext.Provider value={{ actionCards, selectedIndex, setSelectedIndex }}>
        <ActionFunctionsContext.Provider value={{yesAction: handleYesAction, noAction: handleNoAction}}>
          <div className='w-full h-full flex flex-col justify-end overflow-hidden text-base bg-dimshadow' onClick={focusOnInput}>
            <input
              className='w-0 h-0 absolute'
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={handleKeyDown}
              onChange={handleInput}
              value={inputValue}
              ref={inputRef}
            />
            <div className='px-[2ch] flex flex-col-reverse'>
              { 
                actionCards.length === 0
                  ? <></>
                  : actionCards.slice(selectedIndex)
              }
            </div>
            <p className={`px-[2ch] text-highlight ${outputStyle} w-fit ${commandNotFound || showOutput ? 'visible' : 'invisible'}`}>{outputStr}</p>
            <div className={`${isInputFocused ? '' : 'opacity-70'} flex flex-row px-[1ch] bg-highlight whitespace-pre w-fit h-fit text-dimshadow`}>
              {
                inputValue === ""
                ? <><LessFileIndicator fileString={fileString}/> {filteredFriends.length !== 0 && `${selectedIndex + 1}/${filteredFriends.length}`} <p>press 'q' to quit</p></>
                : <p>{inputValue}</p>
              }
            </div>
          </div>
        </ActionFunctionsContext.Provider>
      </ActionCardsContext.Provider>
    </FriendActionContext.Provider>
  )

  function focusOnInput() {
    inputRef.current?.focus();
    setIsInputFocused(true);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {

    const { key } = event;

    if (key === "ArrowUp" && selectedIndex < filteredFriends.length - 1)
      setSelectedIndex(selectedIndex + 1);

    if (key === "ArrowDown" && selectedIndex > 0)
      setSelectedIndex(selectedIndex - 1);

    if (key === "Enter" && inputValue !== "") {
      runFriendActionCommands(inputValue.slice(1));
      setInputValue("");
      setIsCommandMode(false);
    }

    if (key === "q" && !isCommandMode) {
      setTimeout(() => onQuit(), 10);
      return;
    }
  }

  function setActionFunctions() {
    switch (action) {
      case ACTION_TYPE.ACCEPT:
        yesAction = acceptFriend;
        noAction = deleteFriendship;
        break;
      case ACTION_TYPE.BLOCK:
        yesAction = blockExistingFriend;
        break;
      case ACTION_TYPE.UNBLOCK:
        yesAction = deleteFriendship;
        break;
      case ACTION_TYPE.UNFRIEND:
        yesAction = deleteFriendship;
        break;
      default:
        break;
    }
  }

  function handleYesAction(friendIntraName: string, shouldShow: boolean) {
    yesAction(friendIntraName)
      .then(() => getFriendList())
      .then((data) => {
        setFriends(data.data);
        const newActionCards = [...actionCards.slice(0, selectedIndex), ...actionCards.slice(selectedIndex + 1)];
        if (selectedIndex >= newActionCards.length) {
          setSelectedIndex(newActionCards.length - 1);
        } else {
          setSelectedIndex(selectedIndex);
        }
        actionCards = newActionCards;
        if (shouldShow) {
          if (action !== ACTION_TYPE.UNFRIEND) setOutputStyle("bg-accCyan");
          setOutputStr(getOutputString(friendIntraName));
          setShowOutput(true);
        }
      })
      .catch(err => console.log(err));
  }

  function handleNoAction(friendIntraName: string, shouldShow: boolean) {
    noAction(friendIntraName)
      .then(() => getFriendList())
      .then((data) => {
        setFriends(data.data);
        const newActionCards = [...actionCards.slice(0, selectedIndex), ...actionCards.slice(selectedIndex + 1)];
        if (selectedIndex >= newActionCards.length) {
          setSelectedIndex(newActionCards.length - 1);
        } else {
          setSelectedIndex(selectedIndex);
        }
        actionCards = newActionCards;
        if (shouldShow) {
          setOutputStyle("bg-accRed");
          setOutputStr(`You rejected friend request from '${friendIntraName}'`);
          setShowOutput(true);
        }
      })
      .catch(err => console.log(err));
  }

  function blockStrangerAction(strangerIntraName: string, shouldShow: boolean) {
    blockStranger(strangerIntraName)
      .then((data) => {
        console.log(data);
        return getFriendList()
      })
      .then((data) => {
        setFriends(data.data);
        const newActionCards = [...actionCards.slice(0, selectedIndex), ...actionCards.slice(selectedIndex + 1)];
        if (selectedIndex >= newActionCards.length) {
          setSelectedIndex(newActionCards.length - 1);
        } else {
          setSelectedIndex(selectedIndex);
        }
        actionCards = newActionCards;
        if (shouldShow) {
          setOutputStyle("bg-accRed");
          setOutputStr(`You rejected friend request from '${strangerIntraName}'`);
          setShowOutput(true);
        }
      })
      .catch(err => console.log(err));
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    let value = e.currentTarget.value;

    if (value === "") {
      setIsCommandMode(false);
    }

    if (value !== "") {
      setCommandNotFound(false);
      setShowOutput(false);
    }

    if (value[0] !== 'q' && value[0] !== ':') {
      setInputValue("");
      return ;
    }

    if (value[0] === ':') {
      setIsCommandMode(true);
    }

    setInputValue(value);
  }

  function createFriendActionCards() {
    filteredFriends.map((friend, index) => 
      (friend.status === "STRANGER" && action === ACTION_TYPE.BLOCK)
      ? actionCards.push(
        <FriendActionCard
          key={friend.id}
          index={index}
          friend={friend}
          user={user}
          ignoreAction={ignoreAction}
          alternativeAction={() => blockStrangerAction(friend.receiverIntraName, true)}
        />
      )
      : actionCards.push(
        <FriendActionCard
          key={friend.id}
          index={index}
          friend={friend}
          user={user}
          ignoreAction={ignoreAction}
        />
      )
    )
  }

  function ignoreAction() {
    if (selectedIndex < filteredFriends.length - 1)
      setSelectedIndex(selectedIndex + 1);
  }

  function getOutputString(friendUserName:string) {
    switch (action) {
      case ACTION_TYPE.ACCEPT:
        return `'${friendUserName}' is your friend now! HOORAY!`
      case ACTION_TYPE.BLOCK:
        return `'${friendUserName}' has been blocked. :(`
      case ACTION_TYPE.UNBLOCK:
        return `'${friendUserName}' has been unblocked. You need to send another friend request to be his/her friend again.`
      case ACTION_TYPE.UNFRIEND:
        return `'${friendUserName}' has been unfriended. Bye bye friend...`
      default:
        return '';
    }
  }

  function runFriendActionCommands(command: string) {

    if (yesAction === undefined|| noAction === undefined) setActionFunctions();

    if (command === "") return ;

    let splitedCommand = command.split(" ");

    if (command === "y" || command === "yes") {
      const friend = filteredFriends[selectedIndex];
      const friendIntraName = (user.intraName === friend.receiverIntraName ? friend.senderIntraName : friend.receiverIntraName);
      handleYesAction(friendIntraName, true);
      return;
    }
    
    if (command === "Y" || command === "YES") {
      for (const friend of friends) {
        const friendIntraName = (user.intraName === friend.receiverIntraName ? friend.senderIntraName : friend.receiverIntraName);
        handleYesAction(friendIntraName, false);
        setOutputStyle("bg-accCyan");
        setOutputStr(`${action}ed all friend requests!`);
        setShowOutput(true);
      }
      return;
    }
    
    if (command === "n" || command === "no") {
      if (action !== ACTION_TYPE.ACCEPT) {
        ignoreAction();
      } else {
        const friend = filteredFriends[selectedIndex];
        const friendIntraName = (user.intraName === friend.receiverIntraName ? friend.senderIntraName : friend.receiverIntraName);
        handleNoAction(friendIntraName, true);
      }
      return;
    }
    
    if (command === "N" || command === "NO") {
      if (action !== ACTION_TYPE.ACCEPT) {
        setTimeout(() => onQuit(), 10);
      } else {
        for (const friend of friends) {
          const friendIntraName = (user.intraName === friend.receiverIntraName ? friend.senderIntraName : friend.receiverIntraName);
          handleNoAction(friendIntraName, false);
          setOutputStyle("bg-accRed");
          setOutputStr(`Rejected all friend requests!`);
          setShowOutput(true);
        }
      }
      return;
    }

    if ((command === "i" || command == "ignore") && action === ACTION_TYPE.ACCEPT) {
      ignoreAction();
      return;
    }

    if ((command === "I" || command === "IGNORE") && action === ACTION_TYPE.ACCEPT) {
      setTimeout(() => onQuit(), 10);
      return;
    }

    if (command === "p" || command === "profile") {
      return;
    }

    if (splitedCommand.length === 2 && splitedCommand[0] === "profile") {
      // get splitedCommand[1] as a user
      return;
    }
    setOutputStr(`Command not found: ${command}`);
    setCommandNotFound(true);
  }

  function filterFriends() {
    switch (action) {
      case ACTION_TYPE.ACCEPT:
        return friends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.senderIntraName != user.intraName);
      case ACTION_TYPE.BLOCK:
        return friends.filter(friend => ((friend.status.toLowerCase() === "accepted") || (friend.status.toLowerCase() === "pending" && friend.senderIntraName !== user.intraName)));
      case ACTION_TYPE.UNBLOCK:
        return friends.filter(friend => (friend.status.toLowerCase() === "blocked") && friend.senderIntraName === user.intraName);
      case ACTION_TYPE.UNFRIEND:
        return friends.filter(friend => (friend.status.toLowerCase() === "accepted"  || (friend.status.toLowerCase() === "blocked" && friend.senderIntraName === user.intraName)));
      default:
        return [];
    }
  }
}

export default FriendAction