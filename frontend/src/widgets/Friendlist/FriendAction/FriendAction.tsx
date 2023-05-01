import React, { useEffect, useRef, useState } from 'react'
import FriendActionCard, { ACTION_TYPE } from './FriendActionCard'
import LessFileIndicator from '../../Less/LessFileIndicator'
import { FriendData } from '../../../modal/FriendData'
import { UserData } from '../../../modal/UserData'

interface FriendActionProps {
  user: UserData;
  friends: FriendData[];
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

// should take in FriendData[]
function FriendAction(props: FriendActionProps) {

  // props
  const { user, friends, action, onQuit } = props;
  const fileString = `./usr/${user.userName}/friend/${getFileName(action)} `

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
    console.log(command);
  }, [command]);

  useEffect(() => {
    console.log(inputValue);
  }, [inputValue])

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
        {
          element.slice(selectedIndex)
        }
      </div>
      <p className='px-[2ch] text-highlight bg-accRed w-fit hidden'>OPTION NOT FOUND</p>
      <div className={`${isInputFocused ? '' : 'opacity-70'} flex flex-row px-[1ch] bg-highlight whitespace-pre w-fit h-fit text-dimshadow`}>
        {
          inputValue === ""
          ? <><LessFileIndicator fileString={fileString}/> {friends.length !== 0 && `${selectedIndex + 1}/${friends.length}`} <p>press 'q' to quit</p></>
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

    if (key === "ArrowUp" && selectedIndex < friends.length - 1)
      setSeletectIndex(selectedIndex + 1);

    if (key === "ArrowDown" && selectedIndex > 0)
      setSeletectIndex(selectedIndex - 1);

    if (key === "Enter" && inputValue !== "") {
      setCommand(inputValue.slice(1));
      setInputValue("");
    }

    if (key === "q") {
      setTimeout(() => onQuit(), 10);
      return;
    }
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    let value = e.currentTarget.value;

    if (value[0] !== 'q' && value[0] !== ':') {

      if (commandNotFound)
        setCommandNotFound(false);
      
      setInputValue("");
      return ;
    }


    setInputValue(value);
  }

  function createFriendActionCards() {
    friends.map((friend, index) => 
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
    if (selectedIndex < friends.length - 1)
      setSeletectIndex(selectedIndex + 1);
  }
}

export default FriendAction