import React, { useState } from 'react'
import { UserData } from '../../model/UserData'

interface UserFormNameProps {
  user: UserData,
  awesomeSynonym: string,
  updateName: (name: string) => void,
}

function UserFormName(props: UserFormNameProps) {

  const [userName, setUsername] = useState(props.user.userName);

  return (
    <div className="flex flex-col gap-2">
      <p className='font-semibold text-lg lg:text-xl'>
        Your {props.awesomeSynonym} name
      </p>
      <p className='font-normal text-sm text-highlight/60'>
        (Alphanumeric, '-', and '_' only)
      </p>
      <input
        className={`bg-dimshadow border-highlight border-2 lg:border-4 rounded-md font-semibold text-xs sm:text-sm md:text-lg lg:text-xl p-2 lg:p-3 w-full focus:[outline:none] focus:animate-pulse-short cursor-text`}
        type="text"
        name="name"
        value={userName}
        autoComplete="off"
        onChange={handleOnchangeUsername}
      />
    </div>
  )

  function handleOnchangeUsername(e: React.FormEvent<HTMLInputElement>) {
    setUsername(e.currentTarget.value);
    props.updateName(e.currentTarget.value);
  }
}

export default UserFormName