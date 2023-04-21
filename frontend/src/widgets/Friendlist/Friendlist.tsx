import React, { useEffect, useRef, useState } from 'react'
import FriendlistTitle from './FriendlistTitle'
import FriendlistCategory from './FriendlistCategory';
import FriendlistEmpty from './FriendlistEmpty';
import { UserData } from '../../modal/UserData';
import { FriendData, FriendTags } from '../../modal/FriendData';

interface FriendlistProps {
  userData: UserData;
  friendsData: FriendData[];
  onQuit: () => void;
}

function Friendlist(props: FriendlistProps) {

  // Props
  const { userData, friendsData, onQuit } = props;

  // Use Hooks
  const [match, setMatch] = useState('');
  const [searching, setSearching] = useState(false);
  const [numOfLines, setNumOfLines] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Filtered Raw data
  const acceptedFriends = filterFriends(friendsData, FriendTags.accepted);
  const pendingFriends = filterFriends(friendsData, FriendTags.pending);
  const blockedFriends = filterFriends(friendsData, FriendTags.blocked);

  // this should run when the component is mounted
  useEffect(() => {
    handleResize();
    focusOnInput();
    observerSetup();
  }, []);

  // testing
  useEffect(() => {
    console.log(`userData:`, userData);
    console.log(`friends`, friendsData);
  }, []);

  return (
    <div
      className='w-full h-full flex flex-col overflow-hidden text-base uppercase bg-dimshadow px-[2ch] relative'
      onClick={focusOnInput}
    >
      <input
        className='w-o h-0 absolute'
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        ref={inputRef}
      />
      {
        friendsData.length !== 0 ?
        <>
          <div
            className='w-full h-full flex flex-col overflow-hidden gap-y-[1.5rem]'
            ref={divRef}
          > 
            <FriendlistTitle />
            <FriendlistCategory intraName={userData.intraName} friendlist={acceptedFriends} type={FriendTags.accepted}/>
            <FriendlistCategory intraName={userData.intraName} friendlist={pendingFriends} type={FriendTags.pending}/>
            <FriendlistCategory intraName={userData.intraName} friendlist={blockedFriends} type={FriendTags.blocked}/>
          </div>
        </>
        : <FriendlistEmpty />
      }
      <p
        className={`absolute bottom-0 left-0 ${friendsData.length === 0 ? '' : 'whitespace-pre'} lowercase bg-highlight px-[1ch]`}
      >
        {
          !searching
            ? `./usr/${userData.userName}/friends ${friendsData.length === 0 ? '' : `line 1/${numOfLines}`}  press 'q' to quit`
            : match
        }
      </p>
    </div>
  )

  // handle resize. calculate how many line can display on the screen based on the height of the div
  function handleResize() {
    if (divRef.current) {
      const height = divRef.current.clientHeight;
      const lineHeight = 24;
      setNumOfLines(Math.floor(height / lineHeight) + countExtraLine());
    }
  }

  // calculate extra line
  function countExtraLine() {
    let lines = 0;

    if (friendsData.length !== 0)
      lines += 2;
    if (acceptedFriends.length !== 0)
      lines += 2;
    if (pendingFriends.length !== 0)
      lines += 2;
    if (blockedFriends.length !== 0)
      lines += 2;
    return (lines);
  }

  // set up a resize observer to watch the changes (the height) of the div.
  // observer will run handleResize when the div resized.
  function observerSetup() {
    const divElement = divRef.current as Element;
    const observer = new ResizeObserver(handleResize);

    if (divElement) {
      observer.observe(divElement);
    }
    return () => observer.unobserve(divElement);
  }

  // filter friends based on relationship
  function filterFriends(friends: FriendData[], status: string) {
    return friends.filter((friend) => friend.status.toLowerCase() === status);
  }

  // focus on the input field
  function focusOnInput() {
    inputRef.current?.focus();
  }

  // catch the keypress event when focus on the input
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      // move up one line
      case "ArrowUp":
        break;

      // move down one line
      case "ArrowDown":
        break;

      /**
       * 1. If the value is empty && there's still lines below, move down one line
       * 2. If the first character of the value is '/'.
       * 
       * need to reset match to ''
       */
      case "Enter":
        break;

      // check if we are searching a string. if not, call onQuit.
      case "q":
        if (!searching) setTimeout(() => onQuit(), 10);
        break ;
      default:
        break;
    }
  }

  // user input event
  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    setMatch(value);
    if (value[0] === '/') setSearching(true);
  }
}

export default Friendlist