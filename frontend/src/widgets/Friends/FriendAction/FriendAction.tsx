import React, { useContext, useEffect, useRef, useState } from 'react'
import FriendActionCard, { ACTION_TYPE } from './FriendActionCard'
import LessFileIndicator from '../../Less/LessFileIndicator'
import { FriendData } from '../../../modal/FriendData'
import { UserData } from '../../../modal/UserData'
import { FriendsContext } from '../../../contexts/FriendContext'

interface FriendActionProps {
  user: UserData;
  action: string;
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
  const { user, action, onQuit } = props;
  const { friends } = useContext(FriendsContext);
  const fileString = `./usr/${user.userName}/friend/${getFileName(action)} `;
  const filteredFriends: FriendData[] = filterFriends();

  // hooks
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [selectedIndex, setSeletectIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [command, setCommand] = useState("");
  const [commandNotFound, setCommandNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  let element: JSX.Element[] =[];
  
  createFriendActionCards();

  useEffect(() => {
    focusOnInput();
  }, []);

  useEffect(() => {
    runFriendActionCommands();
  }, [command]);

  return (
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
        { element.slice(selectedIndex) }
      </div>
      <p className={`px-[2ch] text-highlight bg-accRed w-fit ${commandNotFound ? 'visible' : 'invisible'}`}>Command not found :{command}</p>
      <div className={`${isInputFocused ? '' : 'opacity-70'} flex flex-row px-[1ch] bg-highlight whitespace-pre w-fit h-fit text-dimshadow`}>
        {
          inputValue === ""
          ? <><LessFileIndicator fileString={fileString}/> {filteredFriends.length !== 0 && `${selectedIndex + 1}/${filteredFriends.length}`} <p>press 'q' to quit</p></>
          : <p>{inputValue}</p>
        }
      </div>
    </div>
  )

  function focusOnInput() {
    inputRef.current?.focus();
    setIsInputFocused(true);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {

    const { key } = event;

    if (key === "ArrowUp" && selectedIndex < filteredFriends.length - 1)
      setSeletectIndex(selectedIndex + 1);

    if (key === "ArrowDown" && selectedIndex > 0)
      setSeletectIndex(selectedIndex - 1);

    if (key === "Enter" && inputValue !== "") {
      if (inputValue.slice(1) === "") {
        setInputValue("");
        return ;
      }
      setCommand(inputValue.slice(1));
    }

    if (key === "q") {
      setTimeout(() => onQuit(), 10);
      return;
    }
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    let value = e.currentTarget.value;

    if (value !== "")
      setCommandNotFound(false);

    if (value[0] !== 'q' && value[0] !== ':') {
      setInputValue("");
      return ;
    }

    setInputValue(value);
  }

  function createFriendActionCards() {
    filteredFriends.map((friend, index) => 
      element.push(
        <FriendActionCard
          key={friend.id}
          index={index}
          selectedIndex={selectedIndex}
          friend={friend}
          action={action}
          user={user}
          ignoreAction={ignoreAction}
        />
      )
    )
  }

  function ignoreAction() {
    if (selectedIndex < filteredFriends.length - 1)
      setSeletectIndex(selectedIndex + 1);
  }

  function runFriendActionCommands() {

    if (command === "") return ;

    let splitedCommand = command.split(" ");

    // run yesAction on current friend
    if (command === "y" || command === "yes") {
      console.log(`yas`);
      return ;
    }

    // run yesAction on all friends in the list
    if (command === "Y" || command === "YES") {
      console.log(`yas to all`);
      return ;
    }

    // run noAction
    if (command === "n" || command === "no") {
      console.log(`nope`);
      return ;
    }
    
    if (command === "N" || command === "NO") {
      console.log(`nope to all`);
      return ;
    }

    // ignore current
    if (command === "i" || command == "ignore") {
      ignoreAction();
      console.log(`ignore this`)
      return ;
    }

    // ignore all
    if (command === "I" || command === "IGNORE") {
      console.log(`ignore all`)
      return ;
    }

    // check current user profile
    if (command === "p" || command === "profile") {
      console.log(`check current user profile`)
      return ;
    }

    // check a user's profile
    if (splitedCommand.length === 2 && splitedCommand[0] === "profile") {
      // get splitedCommand[1] as a user
    }

    setCommandNotFound(true);
    setInputValue("");
  }

  function filterFriends() {
    switch (action) {
      case ACTION_TYPE.ACCEPT:
        return friends.filter(friend => (friend.status.toLowerCase() === "pending") && friend.senderIntraName != user.intraName);
      case ACTION_TYPE.BLOCK:
        return friends.filter(friend => (friend.status.toLowerCase() === "accepted"));
      case ACTION_TYPE.UNBLOCK:
        return friends.filter(friend => (friend.status.toLowerCase() === "blocked"));
      case ACTION_TYPE.UNFRIEND:
        return friends;
      default:
        return [];
    }
  }
}

export default FriendAction