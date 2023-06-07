import React from 'react'
import { FaHandshake } from 'react-icons/fa'
import { CollapsiblePopup } from '../../../components/Popup'

interface FriendRequestProps {
  total: number
}

function FriendRequestContent(props: FriendRequestProps) {

  let totalRequest = (props.total > 99 ? 99 : props.total);

  return (
    <div className='flex flex-col items-center w-full mt-5 select-none h-fit bg-dimshadow'>
      <p className='text-lg font-bold text-accCyan'>({totalRequest}) New Friend Request</p>
      <p className='text-sm text-highlight/50 animate-pulse'>Please check your friendlist!</p>
    </div>
  )
}

function FriendRequestIcon() {
  return (
    <div className='h-full w-full bg-accCyan text-3xl hover:text-4xl transition-all duration-[0.2s] ease-in-out select-none'>
      <FaHandshake className='w-fit h-fit m-auto pt-[30px] text-highlight' />
    </div>
  )
}

function FriendRequestPopup(props: FriendRequestProps) {
  return (
    <CollapsiblePopup
      icon={<FriendRequestIcon />}
      content={<FriendRequestContent total={props.total} />}
    />
  )
}

export default FriendRequestPopup