import React from 'react'
import { FaUsers } from 'react-icons/fa'
import { CollapsiblePopup } from '../components/Popup'

interface FriendRequestProps {
  total: number
}

function FriendRequestContent(props: FriendRequestProps) {

  let totalRequest = (props.total > 99 ? 99 : props.total);

  return (
    <div className='w-full h-fit bg-dimshadow flex flex-col items-center mt-5 select-none'>
      <p className='text-lg text-accCyan font-bold'>({totalRequest}) New Friend Request</p>
      <p className='text-sm text-highlight/50 animate-pulse'>Please check your friendlist!</p>
    </div>
  )
}

function FriendRequestIcon() {
  return (
    <div className='h-full w-full bg-accCyan text-3xl hover:text-4xl transition-all duration-[0.2s] ease-in-out select-none'>
      <FaUsers className='w-fit h-fit m-auto pt-[30px] text-highlight'/>
    </div>
  )
}

function FriendRequest(props: FriendRequestProps) {
  return (
    <CollapsiblePopup
      icon={<FriendRequestIcon />}
      content={<FriendRequestContent total={props.total}/>}
    />
  )
}

export default FriendRequest