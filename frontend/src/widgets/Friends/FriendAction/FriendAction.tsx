import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import FriendActionCard, { ACTION_TYPE } from './FriendActionCard'
import LessFileIndicator from '../../Less/LessFileIndicator'
import { FriendData } from '../../../model/FriendData'
import { UserData } from '../../../model/UserData'
import { ActionCardsContext, ActionFunctionsContext, FriendActionContext, FriendsContext, SelectedFriendContext } from '../../../contexts/FriendContext'
import { acceptFriend, addFriend, blockExistingFriend, blockStranger, deleteFriendship } from '../../../functions/friendactions'
import { AxiosResponse } from 'axios'
import { getFriendList } from '../../../functions/friendlist'
import PreviewProfileContext from '../../../contexts/PreviewProfileContext'
import UserContext from '../../../contexts/UserContext'
import Profile from '../../Profile/Profile'

interface FriendActionProps {
  user: UserData;
  action: string;
  useSelectedFriends?: boolean;
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
  const { user, action, useSelectedFriends, onQuit } = props;
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
  const { friends: selectedFriends, setFriends: setSelectedFriends } = useContext(SelectedFriendContext);
  const inputRef = useRef<HTMLInputElement>(null);

  let actionCards: JSX.Element[] = [];
  let yesAction: (name: string) => Promise<AxiosResponse>;
  let noAction: (name: string) => Promise<AxiosResponse>;

  const filteredFriends: FriendData[] = useSelectedFriends !== undefined ? selectedFriends : filterFriends();

  setActionFunctions();
  createFriendActionCards();

  useEffect(() => {
    focusOnInput();
    setActionFunctions();
  }, []);

  useLayoutEffect(() => {
    createFriendActionCards();
  }, []);

  return (
    <FriendActionContext.Provider value={action}>
      <ActionCardsContext.Provider value={{ actionCards, selectedIndex, setSelectedIndex }}>
        <ActionFunctionsContext.Provider value={{ yesAction: handleYesAction, noAction: handleNoAction, alternativeAction: blockStrangerAction }}>
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
              { actionCards.length === 0 ? <></> : actionCards.slice(selectedIndex) }
            </div>
            <p className={`px-[2ch] text-highlight ${outputStyle} w-fit ${commandNotFound || showOutput ? 'visible' : 'invisible'}`}>{outputStr}</p>
            <div className={`${isInputFocused ? '' : 'opacity-70'} flex flex-row px-[1ch] bg-highlight whitespace-pre w-fit h-fit text-dimshadow`}>
              {
                inputValue === ""
                  ? <><LessFileIndicator fileString={fileString} /> {filteredFriends.length !== 0 && `${selectedIndex + 1}/${filteredFriends.length}`} <p>press 'q' to quit</p></>
                  : <p>{inputValue}</p>
              }
            </div>
            <div className='flex-col'>
              <p className='flex-row flex justify-between'>
                <span className='text-highlight'><span className='bg-highlight text-dimshadow'>:Y</span> Yes to all</span>
                <span className='text-highlight'><span className='bg-highlight text-dimshadow'>:N</span> No to all</span>
                { action === ACTION_TYPE.ACCEPT ? <span className='text-highlight'><span className='bg-highlight text-dimshadow'>:I</span> Ignore all</span> : <></> }
                <span></span>
              </p>
              <p className='flex-row flex justify-between'>
                <span className='text-highlight'><span className='bg-highlight text-dimshadow'>:y</span> yes to current</span>
                <span className='text-highlight'><span className='bg-highlight text-dimshadow'>:n</span> no to current</span>
                { action === ACTION_TYPE.ACCEPT ? <span className='text-highlight'><span className='bg-highlight text-dimshadow'>:i</span> ignore current</span> : <></> }
                <span></span>
              </p>
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

  function cleanUpSelectedFriends() {
    if (selectedFriends === undefined) return;

    const newSelectedFriends = [...selectedFriends.slice(0, selectedIndex), ...selectedFriends.slice(selectedIndex + 1)];
    setSelectedFriends(newSelectedFriends);
  }

  function handleYesAction(friendIntraName: string, shouldShow: boolean) {
    yesAction(friendIntraName)
      .then(() => getFriendList())
      .then((data) => {
        setFriends(data.data);
        cleanUpSelectedFriends();
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
        cleanUpSelectedFriends();
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
      .then(() => getFriendList())
      .then((data) => {
        setFriends(data.data);
        cleanUpSelectedFriends();
        const newActionCards = [...actionCards.slice(0, selectedIndex), ...actionCards.slice(selectedIndex + 1)];
        if (selectedIndex >= newActionCards.length) {
          setSelectedIndex(newActionCards.length - 1);
        } else {
          setSelectedIndex(selectedIndex);
        }
        actionCards = newActionCards;
        if (shouldShow) {
          setOutputStyle("bg-accRed");
          setOutputStr(getOutputString(strangerIntraName));
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
      return;
    }

    if (value[0] === ':') {
      setIsCommandMode(true);
    }

    setInputValue(value);
  }

  function createFriendActionCards() {
    filteredFriends.map((friend, index) =>
      actionCards.push(
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

  function getOutputString(friendUserName: string) {
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

    if (yesAction === undefined || noAction === undefined) setActionFunctions();

    if (command === "y") {
      const friend = filteredFriends[selectedIndex];
      const friendIntraName = (user.intraName === friend.receiver.intraName ? friend.sender.intraName : friend.receiver.intraName);
      if (friend.status === "STRANGER")
        blockStrangerAction(friendIntraName, true);
      else
        handleYesAction(friendIntraName, true);
    } else if (command === "Y") {
      const friendList = useSelectedFriends ? selectedFriends : filteredFriends;
      for (const friend of friendList) {
        const friendIntraName = (user.intraName === friend.receiver.intraName ? friend.sender.intraName : friend.receiver.intraName);
        if (friend.status === "STRANGER")
          blockStrangerAction(friendIntraName, false);
        else
          handleYesAction(friendIntraName, false);
      }
    } else if (command === "n") {
      if (action !== ACTION_TYPE.ACCEPT) {
        ignoreAction();
      } else {
        const friend = filteredFriends[selectedIndex];
        const friendIntraName = (user.intraName === friend.receiver.intraName ? friend.sender.intraName : friend.receiver.intraName);
        handleNoAction(friendIntraName, true);
      }
    } else if (command === "N") {
      if (action !== ACTION_TYPE.ACCEPT) {
        setTimeout(() => onQuit(), 10);
      } else {
        const friendList = useSelectedFriends ? selectedFriends : filteredFriends;
        for (const friend of friendList) {
          const friendIntraName = (user.intraName === friend.receiver.intraName ? friend.sender.intraName : friend.receiver.intraName);
          handleNoAction(friendIntraName, false);
        }
      }
    } else if ((command === "i") && action === ACTION_TYPE.ACCEPT) {
      ignoreAction();
    } else if ((command === "I") && action === ACTION_TYPE.ACCEPT) {
      setTimeout(() => onQuit(), 10);
    } else {
      setOutputStr(`Command not found: ${command}`);
      setCommandNotFound(true);
    }
  }

  function filterFriends() {
    switch (action) {
      case ACTION_TYPE.ACCEPT:
        return friends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.sender.intraName != user.intraName);
      case ACTION_TYPE.BLOCK:
        return friends.filter(friend => ((friend.status.toLowerCase() === "accepted") || (friend.status.toLowerCase() === "pending")));
      case ACTION_TYPE.UNBLOCK:
        return friends.filter(friend => (friend.status.toLowerCase() === "blocked") && friend.sender.intraName === user.intraName);
      case ACTION_TYPE.UNFRIEND:
        return friends.filter(friend => (friend.status.toLowerCase() === "accepted"
          || (friend.status.toLowerCase() === "blocked" && friend.sender.intraName === user.intraName)
          || (friend.status.toLowerCase() === "pending" && friend.sender.intraName === user.intraName)));
      default:
        return [];
    }
  }
}

export default FriendAction