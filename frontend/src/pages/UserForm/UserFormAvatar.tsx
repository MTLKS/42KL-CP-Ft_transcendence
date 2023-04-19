import React, { useEffect, useRef, useState } from 'react'
import { UserData } from '../../modal/UserData'
import { toDataUrl } from '../../functions/toDataURL';

interface UserFormAvatarProps {
  intraID: string,
  avatarUrl: string,
  setAvatar: (newAvatar: string) => void
}

function UserFormAvatar(props: UserFormAvatarProps) {

  const { intraID, avatarUrl, setAvatar } = props;
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputFileRef.current?.click();
  }

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    // define a callback function to be called when the file is loaded
    reader.onload = () => {
      if (reader.readyState === 2) {
        props.setAvatar(reader.result as string);
      }
    };
    reader.readAsDataURL(e.target.files![0]);
  }

  return (
    <div className='flex flex-col w-[50%] h-fit max-w-md rounded-2xl overflow-hidden border-highlight border-4'>
      <img className='h-full w-full object-cover aspect-square lg:aspect[0.5/0.5]' src={avatarUrl} alt={`${intraID}'s avatar`} />
      <div
        className='select-none capitalize text-dimshadow hover:text-highlight bg-highlight hover:bg-dimshadow text-center py-2 lg:py-3 cursor-pointer font-semibold lg:font-extrabold transition hover:ease-in-out'
        onClick={handleButtonClick}
      >
        Upload new avatar
      </div>
      <input
        className='hidden'
        type="file"
        accept=".jpg, .jpeg, .png"
        ref={inputFileRef}
        onChange={handleChangeAvatar}
      />
  </div>
  )
}

export default UserFormAvatar