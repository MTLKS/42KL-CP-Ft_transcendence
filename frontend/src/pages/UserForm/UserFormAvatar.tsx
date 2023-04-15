import React, { useState } from 'react'
import { UserData } from '../../modal/UserData'

function UserFormAvatar(props: UserData) {

    // by default it's their intra avatar
    const [avatarURL, setAvatarURL] = useState(props.avatarURL)

  return (
    <div className='flex flex-col w-[50%] h-fit max-w-md rounded-2xl overflow-hidden border-highlight border-4'>
      <img className='h-full w-full object-cover aspect-square lg:aspect[0.5/0.5]' src={avatarURL} />
      <div
        className='select-none capitalize text-dimshadow hover:text-highlight bg-highlight hover:bg-dimshadow text-center py-2 lg:py-3 cursor-pointer font-semibold lg:font-extrabold transition hover:ease-in-out'
        onClick={handleChangeAvatar}
      >
        Upload new avatar
      </div>
  </div>
  )

  function handleChangeAvatar() {
    setAvatarURL(`https://i.insider.com/62d86af3d0011000190fb681?width=897&format=jpeg`);
  }
}

export default UserFormAvatar