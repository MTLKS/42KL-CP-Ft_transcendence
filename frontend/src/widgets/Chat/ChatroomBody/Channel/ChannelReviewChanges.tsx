import React, { useContext, useEffect, useMemo, useState } from 'react'
import { NewChannelContext } from '../../../../contexts/ChatContext'
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import { ModeratorAction, NewChannelState } from './newChannelReducer';

interface ChannelReviewChangesProps {
  previousChannelInfo: NewChannelState;
  isReviewingChanges: boolean;
  setIsReviewingChanges: (isReviewingChanges: boolean) => void;
}

enum ChangeType {
  CHANGED_CHANNEL_NAME,
  DISABLED_PASSWORD,
  ENABLED_PASSWORD,
  CHANGED_PASSWORD,
  CHANGED_CHANNEL_VISIBILITY,
  WRONG_PASSWORD,
  PROMOTE,
  DEMOTE
}

function ChannelReviewChanges(props: ChannelReviewChangesProps) {

  const { previousChannelInfo, isReviewingChanges, setIsReviewingChanges } = props;
  const { state, dispatch } = useContext(NewChannelContext);
  const [opacity, setOpacity] = useState(0);
  const logsComponent = useMemo(generateChangesLogs, [state]);

  useEffect(() => {
    setOpacity(1);
  }, []);

  return (
    <div
      style={{opacity: `${opacity}`}}
      className='p-3 w-full h-full box-border bg-highlight rounded relative overflow-hidden flex flex-col transition-opacity duration-700'>
      <div>
        <button className='absolute border-dimshadow border-2 hover:bg-highlight hover:text-dimshadow aspect-square bg-dimshadow text-highlight rounded p-1' onClick={() => setIsReviewingChanges(!isReviewingChanges)} ><FaTimes /></button>
        <p className='text-lg font-extrabold w-fit mx-auto px-[1ch] text-center text-highlight bg-dimshadow'>CHANGES</p>
      </div>
      <div className='w-full h-full scrollbar-hide overflow-scroll box-border flex flex-col pt-[2ch] px-[1ch] text-xs'>
        {logsComponent}
      </div>
    </div>
  )

  function ChannelLog(type: ChangeType, memberName: string, previousValue: string, newValue: string) {
    switch (type) {
      case ChangeType.CHANGED_CHANNEL_NAME:
        return (<p key={type + Date.now()} className='flex flex-row whitespace-pre text-dimshadow font-bold items-center w-full'>- CHANGED CHANNEL NAME: <span className='bg-accCyan px-[1ch] text-highlight'>{previousValue}</span> to <span className='bg-accGreen px-[1ch] text-highlight'>{newValue}</span></p>)
      case ChangeType.DISABLED_PASSWORD:
        return (<p key={type + Date.now()} className='flex flex-row whitespace-pre text-dimshadow font-bold items-center'>- <span className='px-[1ch] bg-accRed text-highlight'>DISABLED PASSWORD</span> </p>)
      case ChangeType.ENABLED_PASSWORD:
        return (<p key={type + Date.now()} className='flex flex-row whitespace-pre text-dimshadow font-bold items-center'>- <span className='px-[1ch] bg-accGreen text-highlight'>ENABLED PASSWORD</span> </p>)
      case ChangeType.CHANGED_PASSWORD:
        return (<p key={type + Date.now()} className='flex flex-row whitespace-pre text-dimshadow font-bold items-center'>- <span className='px-[1ch] bg-accRed text-highlight'>Password changed</span></p>)
      case ChangeType.CHANGED_CHANNEL_VISIBILITY:
        return (<p key={type + Date.now()} className='flex flex-row whitespace-pre text-dimshadow font-bold items-center'>- CHANGED CHANNEL VISIBILITY: <span className='bg-accCyan px-[1ch] text-highlight'>{previousValue}</span> to <span className='bg-accGreen px-[1ch] text-highlight'>{newValue}</span></p>)
      default:
        return (<></>)
    }
  }

  function generateChangesLogs() {
    const { channelName, password, newPassword, isPrivate, moderatedList } = state;
    const logs: JSX.Element[] = [];
  
    if (previousChannelInfo.channelName !== channelName) {
      logs.push(ChannelLog(ChangeType.CHANGED_CHANNEL_NAME, '', previousChannelInfo.channelName, channelName));
    }

    // if previously got password, then changed, cancel
    if (previousChannelInfo.password !== null && ((password === null) || (password === null && newPassword === null))) {
      logs.push(ChannelLog(ChangeType.DISABLED_PASSWORD, '', '', ''));
    }

    if (password !== null && newPassword !== null && password !== newPassword) {
      logs.push(ChannelLog(ChangeType.CHANGED_PASSWORD, '', '', ''));
    }

    if (previousChannelInfo.password === null && password !== null) {
      logs.push(ChannelLog(ChangeType.ENABLED_PASSWORD, '', '', ''));
    }

    if (previousChannelInfo.isPrivate !== isPrivate) {
      logs.push(ChannelLog(ChangeType.CHANGED_CHANNEL_VISIBILITY, '', previousChannelInfo.isPrivate ? 'Private' : 'Public', isPrivate ? 'Private' : 'Public'));
    }

    if (logs.length > 0) {
      return (logs);
    }
    return ([
      <div key={"No_changes" + Date.now()} className='relative w-full h-full'>
        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dimshadow text-sm text-center font-bold uppercase underline decoration-wavy decoration-accRed'>No changes were made</p>
      </div>
    ])
  }
}

export default ChannelReviewChanges