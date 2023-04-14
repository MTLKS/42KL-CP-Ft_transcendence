import React, { useState } from 'react'
import { PolkaDotContainer } from '../components/Background'

interface UserFormProps {
  userId: string,
  userAvatar: string,
}

const awesomeSynonyms: string[] = [
  "incredible",
  "fantastic",
  "outstanding",
  "remarkable",
  "splendid",
  "magnificent",
  "exceptional",
  "phenomenal",
  "superb",
  "amazing",
  "admirable",
  "brilliant",
  "dazzling",
  "extraordinary",
  "fabulous",
  "grand",
  "impressive",
  "majestic",
  "spectacular",
  "wondrous",
]

const iceBreakingQuestions: string[] = [
  "What's your favorite useless fact?",
  "Tell us, how do you feel about clowns?",
  "What's the best animal sound you can make?",
  "What's the smelliest food to cook in the office microwave?",
  "What emoji represents you today?",
  "What are you really terrible at?",
  "What is the oldest thing you own?",
  "What's a current trend you think is stupid?",
  "What's the story behind your name?",
]

function UserForm() {

  const [avatarURL, setAvatarURL] = useState('https://cdn.intra.42.fr/users/5452393b87392f586be0b0fe37d5f9c1/large_zah.jpg')

  return (
    <div className='flex flex-row w-[70%] h-fit justify-between absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center'>
      <div className='flex flex-col h-fit rounded-2xl w-[40%] overflow-hidden border-highlight border-4'>
        <img className='h-full w-full object-cover aspect-square' src={avatarURL} alt="" />
        <div
          className='select-none capitalize text-dimshadow bg-highlight text-center py-3 cursor-pointer font-semibold'
          onClick={handleChangeAvatar}
        >
          Upload new avatar
        </div>
      </div>
      <div className='w-[58%] h-full my-auto flex flex-col font-extrabold text-highlight gap-3'>
        <p className='uppercase text-xl'>user info</p>
        <div className="flex flex-col gap-2">
          <p className='font-semibold'>
            Your {awesomeSynonyms[Math.floor(Math.random() * awesomeSynonyms.length)]} name
          </p>
          <input className='bg-dimshadow border-highlight border-4 rounded-md font-semibold text-xl p-3 w-full focus:[outline:none]' type="text" name="user_name" id="" />
        </div>
        <div className='flex flex-col gap-2'>
          <p>{iceBreakingQuestions[Math.floor(Math.random() * iceBreakingQuestions.length)]}</p>
          <textarea className='bg-dimshadow border-highlight border-4 rounded-md font-semibold text-xl p-3 w-full focus:[outline:none]' name="" id="" rows={5} cols={10}></textarea>
        </div>
        <div className='flex-1 w-full h-full bg-highlight text-dimshadow text-center p-3'>
          Submit
        </div>
      </div>
    </div>
  )

  function handleChangeAvatar() {
  }
}

export default UserForm