import React from 'react'
import { FaLock, FaUsers } from 'react-icons/fa';
import { ImEarth } from 'react-icons/im';
import { ChatroomData } from '../../../../model/ChatRoomData';

interface ChannelProps {
  channelInfo: ChatroomData;
}

function Channel(props: ChannelProps) {

  const { channelInfo } = props;
  const { channelName, owner, memberCount, password } = channelInfo;

  return (
    <div className='w-full h-fit py-2.5 border-b-2 border-highlight/50 text-highlight cursor-pointer group'>
      <div className='flex flex-col gap-y-2'>
        <div className='flex flex-row items-center'>
          <p className='w-[16ch] truncate text-base font-extrabold group-hover:underline'>{channelName}</p>
          <div className='relative aspect-square w-3.5 flex flex-row items-center'>
            <ImEarth />
            {
              password !== null &&    
              <div className='absolute bottom-0 -right-1'>
                <FaLock className='text-[8px] text-accYellow bg-dimshadow'/>
              </div>
            }
          </div>
          <p className='ml-5 text-sm tracking-wide uppercase text-highlight/50'>public{password !== null && ' (protected)'}</p>
        </div>
        <div className='flex flex-row justify-between w-full'>
          <div className='flex flex-row text-base font-normal'>
            <p className='whitespace-pre'>owner: </p>
            <p className='text-base font-normal bg-accCyan'>{owner?.userName}</p>
          </div>
          <div className='flex flex-row items-center gap-x-2'>
            <FaUsers />
            {memberCount}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channel