import React, { useState } from 'react'
import { UserData } from '../../modal/UserData'

interface UserFormNameProps {
  user: UserData,
  awesomeSynonym: string,
  borderColor: string,
  updateName: (name: string) => void,
}

function UserFormName(props: UserFormNameProps) {

  const [userName, setUsername] = useState(props.user.intraName);
  const [borderColor, setBorderColor] = useState(props.borderColor);

  return (
    <div className="flex flex-col gap-2">
      <p className='font-semibold text-lg lg:text-xl'>
        Your {props.awesomeSynonym} name
      </p>
      <input
        className={`bg-dimshadow border-${borderColor} border-2 lg:border-4 rounded-md font-semibold text-xs sm:text-sm md:text-lg lg:text-xl p-2 lg:p-3 w-full focus:[outline:none] focus:animate-pulse-short`}
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

  function resetBorderColor() {
    setBorderColor(`highlight`);
  }
}

export default UserFormName