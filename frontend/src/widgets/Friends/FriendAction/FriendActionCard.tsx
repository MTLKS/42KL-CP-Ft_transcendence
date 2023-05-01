import React, { useContext, useMemo, useState } from 'react'
import { FriendData } from '../../../modal/FriendData'
import { getRandomString } from '../../../functions/fun';
import FriendlistEmptyLine from '../Friendlist/FriendlistEmptyLine';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { UserData } from '../../../modal/UserData';
import { BsPersonPlus } from 'react-icons/bs';
import api from '../../../api/api';
import { acceptFriend, addFriend, blockExistingFriend, deleteFriendship } from '../../../functions/friendactions';
import { AxiosResponse } from 'axios';
import { getFriendList } from '../../../functions/friendlist';
import { FriendsContext } from '../../../contexts/FriendContext';

interface FriendActionCardProps {
  index: number;
  selectedIndex: number;
  action?: string;
  friend: FriendData;
  user: UserData;
  ignoreAction: () => void;
}

function FriendActionProfileCard(props: {isCurrentIndex: boolean, user: UserData, friend: FriendData, friendIntraName: string}) {

  const { isCurrentIndex, user, friend, friendIntraName } = props;

  return (
    <div
      className={`flex flex-row ${isCurrentIndex ? 'group cursor-pointer' : ''} group-hover:bg-highlight items-center h-12 w-fit select-none`}
      onClick={() => console.log(`Check this person's profile`)}
    >
      <img
        className="aspect-square h-full object-cover"
        src={friend.avatar}
        alt=""
      />
      <div className='group-hover:bg-highlight h-full p-3.5'>
        <p className='text-highlight group-hover:text-dimshadow font-extrabold text-base w-full h-full select-none'>{friend.userName} ({friendIntraName})</p>
      </div>
    </div>
  )
}

export const ACTION_TYPE = {
  ACCEPT: "accept",
  ADD: "add",
  BLOCK: "block",
  UNFRIEND: "unfriend",
  UNBLOCK: "unblock",
}

function getFriendActionTitle(action: string) {
  if (action === ACTION_TYPE.ACCEPT)
    return "You have received a friend request from "
  return `You are about to ${action} `
}

function FriendActionConfirmation(props: {action: string}) {

  const { action } = props;
  let style = '';

  if (action === ACTION_TYPE.ACCEPT || action === ACTION_TYPE.UNBLOCK)
    style = 'bg-accGreen';
  else if (action === ACTION_TYPE.BLOCK || action === ACTION_TYPE.UNFRIEND)
    style = 'bg-accRed';

  if (action === ACTION_TYPE.ACCEPT)
    return <p>Would you like to <span className={`${style}`}>accept</span> this friend request?</p>
  else if (action === ACTION_TYPE.BLOCK || action === ACTION_TYPE.UNBLOCK || action === ACTION_TYPE.UNFRIEND || action === ACTION_TYPE.ADD)
    return <p>Are you sure you want to <span className={`${style}`}>{action}</span> this friend?</p>
  return <></>
}

interface FriendActionConfirmationButtonsProps {
  action: string;
  friendIntraName: string;
  ignoreAction?: () => void;
}

function FriendActionConfirmationButtons(props: FriendActionConfirmationButtonsProps) {

  const { action, friendIntraName, ignoreAction } = props;
  let yesAction: (name: string) => Promise<AxiosResponse>;
  let noAction: (name:string) => Promise<AxiosResponse>;

  const { setFriends } = useContext(FriendsContext);

  setActionFunctions();

  return (
    <>
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`} onClick={handleYesAction}>
        <span className='font-extrabold'>y</span>es
      </button>
      /
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`}
        onClick={
          ignoreAction === undefined
          ? handleNoAction
          : ignoreAction
        }
      >
        <span className='font-extrabold'>n</span>o
      </button>
      {
        action === ACTION_TYPE.ACCEPT
        ? <>
            /
            <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`} onClick={ignoreAction}>
              <span className='font-extrabold'>i</span>gnore
            </button>
          </>
        : <></>
      }
    </>
  )

  function setActionFunctions() {
    switch (action) {
      case ACTION_TYPE.ADD:
        yesAction = addFriend;
        break;
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

  function handleYesAction() {
    yesAction(friendIntraName)
      .then((data: any) => console.log(data))
      .catch(err => console.log(err));
    
    getFriendList()
      .then((data) => {
        console.log(data.data);
        setFriends(data.data);
      })
      .catch(err => console.log(err));
  }

  function handleNoAction() {
    noAction(friendIntraName)
      .then((data:any) => console.log(data))
      .catch(err => console.log(err));
  }
}

function FriendActionCard(props: FriendActionCardProps) {

  const { index, selectedIndex, action = "", user, friend, ignoreAction } = props;
  const fakeSHAkeyStr = useMemo(() => `+${getRandomString(10)}/${getRandomString(10)}`, []);
  const isCurrentIndex = selectedIndex === index;
  let friendIntraName = (user.intraName === friend.receiverIntraName ? friend.senderIntraName : friend.receiverIntraName);

  return (
    <div className={`flex flex-row gap-x-2 ${!isCurrentIndex && 'opacity-20'}`}>
      <p className='w-[3ch] text-right font-extrabold text-highlight/50 overflow-hidden text-sm'>{index}</p>
      <div className='flex flex-col'>
        <FriendActionProfileCard isCurrentIndex={isCurrentIndex} user={user} friend={friend} friendIntraName={friendIntraName}/>
        <FriendlistEmptyLine />
        <div className='flex flex-col text-base w-full text-highlight'>
          <p>{getFriendActionTitle(action)}'<span className='bg-accCyan select-all'>{friend.userName}</span>'</p>
          <p>PONGSH key fingerprint is SHA256: {fakeSHAkeyStr}</p>
          <div className='flex flex-row whitespace-pre'>
            <FriendActionConfirmation action={action}/>
            <div className={`${!isCurrentIndex && 'hidden'} whitespace-pre`}>
              [<FriendActionConfirmationButtons action={action} friendIntraName={friendIntraName} ignoreAction={ignoreAction}/>]
            </div>
          </div>
        </div>
        <FriendlistEmptyLine />
      </div>
    </div>
  )
}

export default FriendActionCard