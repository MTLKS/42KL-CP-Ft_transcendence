import React, { useState } from 'react'
import { FaUserSecret } from 'react-icons/fa';
import { ImEarth } from 'react-icons/im'
import { NewChannelAction, NewChannelState } from './newChannelReducer';

interface ChannelInfoProps {
  modifying: boolean,
  state: NewChannelState,
  dispatch: React.Dispatch<NewChannelAction>,
}

function ChannelInfo(props: ChannelInfoProps) {

  const { modifying, state, dispatch } = props;
  const [channelName, setChannelName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);

  return (
    <div className='w-[70%] h-fit flex flex-row items-center mx-auto'>
      <div className='w-full flex flex-row justify-between'>
        <button
          className='flex flex-col items-center gap-y-1 w-[30%] aspect-square rounded outline-none focus:border-dashed focus:border-2 focus:border-highlight hover:border-dashed hover:border-2 hover:border-highlight py-3 cursor-pointer relative group'
          onClick={() => setIsPublic(!isPublic)}
        >
          <div className='hidden group-hover:flex transition-all duration-200 ease-in-out absolute p-2 top-0 w-full h-full bg-highlight/80 overflow-hidden rounded text-xl font-extrabold text-dimshadow'>
            <p className='my-auto w-full h-fit uppercase'>Switch to {isPublic ? 'private' : 'public'}</p>
          </div>
          <div className='w-full h-fit flex flex-col items-center my-auto gap-y-2'>
            {isPublic ? <ImEarth className='text-highlight text-7xl' /> : <FaUserSecret className='text-highlight text-7xl' />}
            <p className='text-highlight text-base font-extrabold uppercase underline'>{isPublic ? 'public' : 'private'}</p>
          </div>
        </button>
        <div className='flex flex-col gap-y-4 w-[60%]'>
          <div className='flex flex-col gap-y-2'>
            <p className='text-highlight text-sm font-extrabold'>Channel Name</p> {/** > 1 && <= 16 */}
            {
              modifying
                ? <input type="text" className='rounded border-2 border-highlight bg-dimshadow text-sm font-extrabold text-center text-highlight py-2 px-4 outline-none w-full cursor-text' autoComplete='off' value={channelName} onChange={handleChannelNameOnChange}/>
                : <p>{channelName}</p>
            }
          </div>
          {
            modifying &&
            <div className='flex flex-col gap-y-2'>
              <p className='text-highlight text-sm font-extrabold'>Password</p> {/** > 1 && <= 16 */}
              <input type="password" autoComplete='off' autoCorrect='disabled' className='rounded border-2 border-highlight bg-dimshadow text-base font-extrabold text-center text-highlight py-2 px-4 outline-none cursor-text' value={password} onChange={handlePasswordOnChange} />
            </div>
          }
        </div>
      </div>
    </div>
  )

  function handleChannelNameOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChannelName(e.target.value);
    dispatch({ type: 'SET_CHANNEL_NAME', channelName: e.target.value });
  }

  function handlePasswordOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    dispatch({ type: 'SET_CHANNEL_PASSWORD', password: e.target.value });
  }
}

export default ChannelInfo