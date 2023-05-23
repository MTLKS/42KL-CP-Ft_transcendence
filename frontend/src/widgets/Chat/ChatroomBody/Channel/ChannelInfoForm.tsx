import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaCheck, FaEye, FaTimes, FaUserSecret } from 'react-icons/fa';
import { TbScript } from 'react-icons/tb';
import { ImEarth } from 'react-icons/im'
import { NewChannelAction, NewChannelError, NewChannelState } from './newChannelReducer';
import { NewChannelContext } from '../../../../contexts/ChatContext';

interface ChannelInfoProps {
  isReviewingChanges?: boolean,
  setIsReviewingChanges?: (newState: boolean) => void;
  modifying: boolean,
  setModifyChannel: () => void;
}

function ChannelInfoForm(props: ChannelInfoProps) {

  const { state, dispatch } = useContext(NewChannelContext)
  const { modifying, setModifyChannel, isReviewingChanges = false, setIsReviewingChanges = () => {} } = props;
  const [channelName, setChannelName] = useState<string>(state.channelName);
  const [password, setPassword] = useState<string>(''); // old password for editing, new password for creating
  const [newPassword, setNewPassword] = useState<string>(''); // new password for editing, should only use when editing
  const [isPrivate, setIsPrivate] = useState<boolean>(state.isPrivate);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(state.password !== null);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [showChannelNameNamingRules, setShowChannelNameNamingRules] = useState<boolean>(false);
  const [showPasswordRules, setShowPasswordRules] = useState<boolean>(false);
  const [previousChannelInfo, setPreviousChannelInfo] = useState<NewChannelState>(state);

  return (
    <div className='w-[70%] h-fit flex flex-row items-center mx-auto'>
      <div className='w-full flex flex-row items-center justify-between'>
        <div className='w-[30%] flex flex-col h-full items-center gap-y-2'>
          <button
            className={`flex flex-col items-center gap-y-1 w-full aspect-square rounded outline-none ${modifying ? 'hover:border-dashed hover:border-2 hover:border-highlight cursor-pointer' : 'cursor-default'} focus:border-dashed focus:border-2 focus:border-highlight py-3 relative group`}
            onClick={toggleChannelVisibility}
          >
            <div className={`hidden ${modifying ? 'group-hover:flex' : ''} transition-all duration-200 ease-in-out absolute p-2 top-0 w-full h-full bg-highlight/80 overflow-hidden rounded text-xl font-extrabold text-dimshadow`}>
              <p className='my-auto w-full h-fit uppercase'>Switch to {isPrivate ? 'public' : 'private'}</p>
            </div>
            <div className='w-full h-fit flex flex-col items-center my-auto gap-y-2'>
              {isPrivate ? <FaUserSecret className='text-highlight text-7xl' /> : <ImEarth className='text-highlight text-7xl' />}
              <p className='text-highlight text-base font-extrabold uppercase underline'>{isPrivate ? 'private' : 'public'}</p>
            </div>
          </button>
          { !state.isNewChannel && modifying && <button className='flex flex-row items-center bg-highlight hover:bg-dimshadow text-dimshadow hover:text-highlight border-2 border-highlight w-fit h-fit p-2 text-center rounded text-xs font-bold uppercase whitespace-pre' onClick={() => setIsReviewingChanges(!isReviewingChanges)}><TbScript className='text-base' /> Review Changes</button> }
        </div>
        <div className={`flex flex-col justify-center ${isPrivate && 'my-auto'} gap-y-4 w-[60%]`}>
          <div className='flex flex-col gap-y-2'>
            <p className={`${modifying ? 'text-highlight' : 'text-highlight/50'} text-sm font-extrabold`}>Channel Name</p>
            {
              modifying
                ? <input type="text" className='rounded border-2 border-highlight bg-dimshadow text-sm font-extrabold text-center text-highlight py-2 px-4 outline-none w-full cursor-text' autoComplete='off' value={channelName} onChange={handleChannelNameOnChange} onFocus={() => setShowChannelNameNamingRules(true)} onBlur={() => setShowChannelNameNamingRules(false)} />
                : <p className='text-highlight font-extrabold'>{channelName}</p>
            }
            {
              (state.errors.includes(NewChannelError.INVALID_CHANNEL_NAME) || showChannelNameNamingRules) &&
              <div className='text-xs px-[1ch] text-highlight/50'>
                <p className='whitespace-pre flex flex-row items-center gap-x-2'><span className={`text-xs ${channelName.length > 0 && channelName.length <= 16 && 'text-accGreen'}`}>{channelName.length > 0 && channelName.length <= 16 ? <FaCheck /> : <FaTimes />}</span> {'>'} 1 & {'<='} 16 characters</p>
              </div>
            }
          </div>
          {
            ((!state.isNewChannel && modifying && previousChannelInfo.password !== null && !previousChannelInfo.isPrivate) || (!isPrivate && isPasswordProtected && modifying)) &&
            <div className='flex flex-col gap-y-2'>
              <p className='text-highlight text-sm font-extrabold'>{!state.isNewChannel && changePassword ? 'Old Password' : 'Password'}</p>
             {(!state.isNewChannel && modifying && previousChannelInfo.password !== null && !previousChannelInfo.isPrivate) && <p className='text-[10px] text-highlight/50'>Require password to change channel info</p>}
              <div className='flex flex-row'>
                <input type="password" id='channel-password' autoComplete='off' autoCorrect='disabled' className='w-full h-full rounded rounded-r-none border-2 border-r-0 border-highlight bg-dimshadow text-base font-extrabold text-center text-highlight py-2 px-4 outline-none cursor-text' value={password} onChange={handlePasswordOnChange} onFocus={() => setShowPasswordRules(true)} onBlur={() => setShowPasswordRules(false)} />
                <button className='bg-highlight h-full p-2 font-bold border-2 border-highlight rounded hover:bg-dimshadow hover:text-highlight transition-all duration-150 ease-in-out rounded-l-none' onMouseDown={toggleShowPassword} onMouseUp={toggleShowPassword}><FaEye className='mx-auto' /></button>
              </div>
              {
                (state.isNewChannel && (state.errors.includes(NewChannelError.INVALID_PASSWORD) || showPasswordRules)) &&
                <div className='text-xs px-[1ch] text-highlight/50'>
                  <p className='whitespace-pre flex flex-row items-center gap-x-2'><span className={`text-xs ${password.length > 0 && password.length <= 16 && 'text-accGreen'}`}>{password.length > 0 && password.length <= 16 ? <FaCheck /> : <FaTimes />}</span> {'>'} 1 & {'<='} 16 characters</p>
                </div>
              }
            </div>
          }
          {
            changePassword && !state.isNewChannel && !isPrivate && isPasswordProtected && modifying &&
            <div className='flex flex-col gap-y-2'>
              <p className='text-highlight text-sm font-extrabold'>New Password</p>
              <div className='flex flex-row'>
                <input type="password" id='channel-new-password' autoComplete='off' autoCorrect='disabled' className='w-full h-full rounded rounded-r-none border-2 border-r-0 border-highlight bg-dimshadow text-base font-extrabold text-center text-highlight py-2 px-4 outline-none cursor-text' value={newPassword} onChange={handleNewPasswordOnChange} onFocus={() => setShowPasswordRules(true)} onBlur={() => setShowPasswordRules(false)} />
                <button className='bg-highlight h-full p-2 font-bold border-2 border-highlight rounded hover:bg-dimshadow hover:text-highlight transition-all duration-150 ease-in-out rounded-l-none' onMouseDown={toggleShowNewPassword} onMouseUp={toggleShowNewPassword}><FaEye className='mx-auto' /></button>
              </div>
              {
                (state.errors.includes(NewChannelError.INVALID_NEW_PASSWORD) || (!state.isNewChannel && showPasswordRules)) &&
                <div className='text-xs px-[1ch] text-highlight/50'>
                  <p className='whitespace-pre flex flex-row items-center gap-x-2'><span className={`text-xs ${newPassword.length > 0 && newPassword.length <= 16 && 'text-accGreen'}`}>{newPassword.length > 0 && newPassword.length <= 16 ? <FaCheck /> : <FaTimes />}</span> {'>'} 1 & {'<='} 16 characters</p>
                </div>
              }
            </div>
          }
          {!modifying && <button className='bg-highlight p-2 font-bold border-2 border-highlight rounded hover:bg-dimshadow hover:text-highlight transition-all duration-150 ease-in-out' onClick={toggleEditChannel}>EDIT CHANNEL</button>}
          {modifying && !isPrivate && !isPasswordProtected && <button className='bg-highlight p-2 font-bold border-2 border-highlight rounded hover:bg-dimshadow hover:text-highlight transition-all duration-150 ease-in-out' onClick={togglePassword}>ENABLE PASSWORD</button>}
          {modifying && !isPrivate && isPasswordProtected && <button className='bg-highlight p-2 font-bold border-2 border-highlight rounded hover:bg-dimshadow hover:text-highlight transition-all duration-150 ease-in-out' onClick={togglePassword}>DISABLE PASSWORD</button>}
          {(!previousChannelInfo.isPrivate && previousChannelInfo.password !== null && modifying) && <button className='bg-highlight p-2 font-bold border-2 border-highlight rounded hover:bg-dimshadow hover:text-highlight transition-all duration-150 ease-in-out' onClick={changeChannelPassword}>CHANGE PASSWORD</button>}
          {!state.isNewChannel && modifying && <button className='bg-dimshadow text-accRed p-2 font-bold border-2 border-accRed rounded hover:bg-accRed hover:text-highlight transition-all duration-150 ease-in-out' onClick={toggleEditChannel}>CANCEL</button>}
        </div>
      </div>
    </div>
  )

  function toggleEditChannel() {
    setModifyChannel();
    if (!modifying) {
      const clone = JSON.parse(JSON.stringify(state));
      setPreviousChannelInfo(clone);
    } else {
      dispatch({ type: 'CLONE_STATE', state: previousChannelInfo });
      if (changePassword && !state.isNewChannel && !isPrivate && isPasswordProtected)
        setChangePassword(!changePassword);
      setChannelName(previousChannelInfo.channelName);
      setIsPrivate(previousChannelInfo.isPrivate);
      setIsPasswordProtected(previousChannelInfo.password !== null);
    }
  }

  function toggleChannelVisibility() {
    if (!modifying) return;
    // Toggle channel visibility (public or private)
    setIsPrivate(!isPrivate);
    dispatch({ type: 'SET_CHANNEL_PRIVACY', isPrivate: !isPrivate });

    if (!isPrivate) {
      setPassword('');
      dispatch({ type: 'SET_CHANNEL_PASSWORD', password: null });
      setNewPassword('');
      dispatch({ type: 'SET_CHANNEL_NEW_PASSWORD', newPassword: null });
    }
  }

  function changeChannelPassword() {
    setChangePassword(!changePassword);
  }

  function togglePassword() {
    // Toggle password protection
    setIsPasswordProtected(!isPasswordProtected);
    if (!isPasswordProtected) {
      dispatch({ type: 'SET_CHANNEL_PASSWORD', password: ''});
    }

    // if currently is password protected, clear password
    if (isPasswordProtected) {
      setPassword('');
      dispatch({ type: 'SET_CHANNEL_PASSWORD', password: null });
    }
    
    if (isPasswordProtected && !state.isNewChannel) {
      setNewPassword('');
      dispatch({ type: 'SET_CHANNEL_NEW_PASSWORD', newPassword: null });
    }
  }

  function toggleShowPassword(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const passwordInput = document.getElementById('channel-password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  function toggleShowNewPassword(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const passwordInput = document.getElementById('channel-new-password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  function handleChannelNameOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChannelName(e.target.value);
    dispatch({ type: 'SET_CHANNEL_NAME', channelName: e.target.value });
  }

  function handlePasswordOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    dispatch({ type: 'SET_CHANNEL_PASSWORD', password: e.target.value });
    if (!changePassword) {
      setNewPassword(e.target.value);
      dispatch({ type: 'SET_CHANNEL_NEW_PASSWORD', newPassword: e.target.value });
    }
  }

  function handleNewPasswordOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value);
    dispatch({ type: 'SET_CHANNEL_NEW_PASSWORD', newPassword: e.target.value });
  }
}

export default ChannelInfoForm