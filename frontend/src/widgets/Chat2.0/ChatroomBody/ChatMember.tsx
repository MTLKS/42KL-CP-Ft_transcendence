import { isAxiosError } from 'axios';
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

function ChatMember() {

  const [isSelected, setIsSelected] = useState(false);

  const handleSelectUser = () => {
    setIsSelected(!isSelected);
  }

  return (
    <div
      className='flex flex-row gap-x-5 group items-center cursor-pointer transition-all duration-75 ease-in-out'
      onClick={handleSelectUser}
    >
      <div className='aspect-square object-cover w-12 relative'>
        <img
          className=''
          src="../../../../assets/images/mofyduck.jpeg"
          alt=""
        />
        <div className={`absolute w-full h-full bg-dimshadow/50 top-0 ${isSelected ? 'block' : 'hidden group-hover:block'} transition-all duration-150 ease-in-out p-3`}>
          <FaCheck className='text-2xl text-highlight'/>
        </div>
      </div>
      <p className={`'text-base font-extrabold ${isSelected ? 'text-highlight' : 'text-highlight/50 group-hover:text-highlight'} transition-all duration-150 ease-in-out'`}>MolyDuck</p>
    </div>
  )
}

export default ChatMember