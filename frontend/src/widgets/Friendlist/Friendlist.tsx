import React, { useEffect, useRef, useState } from 'react'
import FriendlistTitle from './FriendlistTitle'
import FriendlistCategory from './FriendlistCategory';
import EmptyFriendlist from './EmptyFriendlist';
import { UserData } from '../../modal/UserData';
import { FriendData, FriendTags } from '../../modal/FriendData';
import FriendlistEmptyLine from './FriendlistEmptyLine';
import FriendlistTag from './FriendlistTag';
import FriendInfo from './FriendInfo';

interface FriendlistProps {
  userData: UserData;
  friendsData: FriendData[];
  onQuit: () => void;
}

function Friendlist(props: FriendlistProps) {

  // Props
  const { userData, friendsData, onQuit } = props;

  // Use Hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [maxDisplayLines, setMaxDisplayLines] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Filtered Raw data
  const acceptedFriends = filterFriends(friendsData, FriendTags.accepted);
  const pendingFriends = filterFriends(friendsData, FriendTags.pending);
  const blockedFriends = filterFriends(friendsData, FriendTags.blocked);
  const sortedFriends = acceptedFriends.concat(pendingFriends, blockedFriends);

  // convert sorted friends into lines
  const lines: JSX.Element[] = createFriendlistComponents(sortedFriends);

  // this should run when the component is mounted
  useEffect(() => {
    handleResize();
    focusOnInput();
    observerSetup();
  }, []);

  // testing
  useEffect(() => {
    console.log(currentLine);
  }, [currentLine]);

  return (
    <div className='w-full h-full flex flex-col overflow-hidden text-base uppercase bg-dimshadow px-[2ch] relative' onClick={focusOnInput}>
      <input
        className='w-0 h-0 absolute'
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        ref={inputRef}
      />
        <div className='w-full h-full flex flex-col overflow-hidden' ref={divRef}>
          {
            friendsData.length === 0
              ? <EmptyFriendlist />
              : lines.slice(currentLine, currentLine + maxDisplayLines)
          }
        </div>
      <p className={`absolute bottom-0 left-0 ${friendsData.length === 0 ? '' : 'whitespace-pre'} lowercase bg-highlight px-[1ch]`}>
        {
          !searching
            ? `./usr/${userData.userName}/friends ${friendsData.length === 0 ? '' : `line ${currentLine + 1}/${lines.length}`}  press 'q' to quit`
            : searchTerm
        }
      </p>
    </div>
  )

  function handleResize() {
    if (divRef.current) {
      const height = divRef.current.clientHeight;
      const lineHeight = 24;
      setMaxDisplayLines(Math.floor(height / lineHeight) + countExtraLine());
    }
  }

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

  function observerSetup() {
    const divElement = divRef.current as Element;
    const observer = new ResizeObserver(handleResize);

    if (divElement) {
      observer.observe(divElement);
    }
    return () => observer.unobserve(divElement);
  }

  function filterFriends(friends: FriendData[], status: string) {
    return friends.filter((friend) => friend.status.toLowerCase() === status);
  }

  function createFriendlistComponents(sortedFriends: FriendData[]) {
    let prevCategory = '';
    let targetCategory: FriendData[] = [];
    let components: JSX.Element[] = [];

    if (sortedFriends.length === 0) return [<EmptyFriendlist />];

    components.push(
      <FriendlistEmptyLine />,
      <FriendlistTitle searchTerm={searchTerm}/>
    );

    sortedFriends.map((friend) => {
      if (prevCategory !== friend.status) {

        switch (friend.status.toLowerCase()) {
          case "accepted":
            targetCategory = acceptedFriends;
            break;
          case "pending":
            targetCategory = pendingFriends;
            break;
          case "blocked":
            targetCategory = blockedFriends;
            break;
          default:
            break;
        }

        components.push(
          <FriendlistEmptyLine />,
          <FriendlistTag key={friend.status} type={friend.status} total={targetCategory.length} searchTerm={searchTerm}/>,
          <FriendlistEmptyLine />
          );
        prevCategory = friend.status;
      }
      components.push(
        <FriendInfo
          key={`${friend.status}_${friend.id}`}
          friend={friend}
          intraName={userData.intraName}
          searchTerm={searchTerm}
        />)
    })
    return (components);
  }

  function focusOnInput() {
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowUp":
        if (currentLine > 0) setCurrentLine(currentLine - 1);
        break;
      case "ArrowDown":
        if (currentLine + 1 < lines.length) setCurrentLine(currentLine + 1);
        break;
      case "Enter":
        if (searchTerm === '')
          setCurrentLine(currentLine + 1);
        break;
      case "q":
        if (!searching) setTimeout(() => onQuit(), 10);
        break;
      default:
        break;
    }
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    let value = e.currentTarget.value;

    if (value[value.length - 1] == '\\') value += '\\';

    setSearchTerm(value);
    if (value[0] === '/') setSearching(true);
  }
}

export default Friendlist