import React, { useMemo, useState } from 'react'
import { FriendData } from '../../../modal/FriendData'
import { getRandomString } from '../../../functions/fun';
import FriendlistEmptyLine from '../FriendlistEmptyLine';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { UserData } from '../../../modal/UserData';
import { BsPersonPlus } from 'react-icons/bs';
import api from '../../../api/api';

interface FriendActionCardProps {
  index: number;
  selectedIndex: number;
  action?: string;
  friend: FriendData;
  user: UserData;
  ignoreAction: () => void;
}

function FriendActionProfileCard(props: {isCurrentIndex: boolean, user: UserData, friend: FriendData}) {

  const { isCurrentIndex, user, friend } = props;
  let intraName = (user.intraName === friend.receiverIntraName ? friend.senderIntraName : friend.receiverIntraName);

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
        <p className='text-highlight group-hover:text-dimshadow font-extrabold text-base w-full h-full select-none'>{friend.userName} ({intraName})</p>
      </div>
    </div>
  )
}

export const ACTION_TYPE = {
  ACCEPT: "accept",
  BLOCK: "block",
  MUTE: "mute",
  UNFRIEND: "unfriend",
  UNBLOCK: "unblock",
  UNMUTE: "unmute"
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
  else if (action === ACTION_TYPE.MUTE || action === ACTION_TYPE.UNMUTE)
    style = 'bg-accCyan';
  else if (action === ACTION_TYPE.BLOCK || action === ACTION_TYPE.UNFRIEND)
    style = 'bg-accRed';

  if (action === ACTION_TYPE.ACCEPT)
    return <p>Would you like to <span className={`${style}`}>accept</span> this friend request?</p>
  else if (action === ACTION_TYPE.BLOCK || action === ACTION_TYPE.UNBLOCK || action === ACTION_TYPE.UNFRIEND
    || action === ACTION_TYPE.MUTE || action === ACTION_TYPE.UNMUTE)
    return <p>Are you sure you want to <span className={`${style}`}>{action}</span> this friend?</p>
  return <></>
}

interface FriendActionConfirmationButtonsProps {
  action: string;
  friend: FriendData;
  ignoreAction?: () => void;
}

type FriendActionFunction = {
  yesAction: any;
  noAction: any;
}

/**
 * YES
 * request: accept (PATCH)
 * add: send request (POST)
 * block: to "BLOCKED" (PATCH)
 * mute: to "MUTED" (PATCH)
 * unfriend: bye bye (DELETE)
 * unblock: bye bye (DELETE)
 * unmute: to "ACCEPTED" (PATCH)
 */

/**
 * NO
 * request: delete
 * add: skip
 * block: skip
 * mute: skip
 * unfriend: skip
 * unblock: skip
 * unmute: skip
 */

function FriendActionConfirmationButtons(props: FriendActionConfirmationButtonsProps) {

  const { action, friend, ignoreAction } = props;
  let actionFunctions: FriendActionFunction;

  setActionFunctions();

  return (
    <>
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`} onClick={() => console.log("yes")}>
        <span className='font-extrabold'>y</span>es
      </button>
      /
      <button className={`hover:bg-highlight hover:text-dimshadow font-thin focus:outline-none focus:bg-highlight focus:text-dimshadow`} onClick={() => console.log("no")}>
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
    const NAMESPACE = "/friendship";

    switch (action) {
      case ACTION_TYPE.ACCEPT:
        actionFunctions.yesAction = api.patch(NAMESPACE, { ...friend, status: "ACCEPTED" });
        actionFunctions.noAction = api.delete(NAMESPACE, {} = friend)
    }
  }
}

function FriendActionCard(props: FriendActionCardProps) {

  const { index, selectedIndex, action = "", user, friend, ignoreAction } = props;
  const fakeSHAkeyStr = useMemo(() => `+${getRandomString(10)}/${getRandomString(10)}`, []);
  const isCurrentIndex = selectedIndex === index;

  return (
    <div className={`flex flex-row gap-x-2 ${!isCurrentIndex && 'opacity-20'}`}>
      <p className='w-[3ch] text-right font-extrabold text-highlight/50 overflow-hidden text-sm'>{index}</p>
      <div className='flex flex-col'>
        <FriendActionProfileCard isCurrentIndex={isCurrentIndex} user={user} friend={friend}/>
        <FriendlistEmptyLine />
        <div className='flex flex-col text-base w-full text-highlight'>
          <p>{getFriendActionTitle(action)}'<span className='bg-accCyan select-all'>{friend.userName}</span>'</p>
          <p>PONGSH key fingerprint is SHA256: {fakeSHAkeyStr}</p>
          <div className='flex flex-row whitespace-pre'>
            <FriendActionConfirmation action={action}/>
            <div className={`${!isCurrentIndex && 'hidden'} whitespace-pre`}>
              [<FriendActionConfirmationButtons action={action} friend={friend} ignoreAction={ignoreAction}/>]
            </div>
          </div>
        </div>
        <FriendlistEmptyLine />
      </div>
    </div>
  )
}

export default FriendActionCard