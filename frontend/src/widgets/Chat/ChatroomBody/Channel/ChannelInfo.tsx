import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChannelMemberList from './ChannelMemberList'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext'
import ChatroomContent from '../Chatroom/ChatroomContent'
import ChannelInfoForm from './ChannelInfoForm'
import { ChatroomData, MemberData, UpdateChannelData } from '../../../../model/ChatRoomData'
import { NewChannelError, NewChannelState } from './newChannelReducer'
import UserContext from '../../../../contexts/UserContext'
import UserFormTfa from '../../../../pages/UserForm/UserFormTfa'
import ChannelReviewChanges from './ChannelReviewChanges'
import { deleteChannel, inviteMemberToChannel, updateChannel } from '../../../../api/chatAPIs'
import { ErrorData } from '../../../../model/ErrorData'
import { FriendsContext } from '../../../../contexts/FriendContext'
import { UserData } from '../../../../model/UserData'
import { FaTimes, FaUserSecret, FaUsers } from 'react-icons/fa'
import { ImEarth } from 'react-icons/im'
import ChatroomList from '../Chatroom/ChatroomList'

interface ChannelInfoProps {
  chatroomData: ChatroomData;
}

function ChannelInfo(props: ChannelInfoProps) {

  const { chatroomData } = props;
  const { myProfile } = useContext(UserContext);
  const { friends } = useContext(FriendsContext);
  const { setChatBody } = useContext(ChatContext);
  const { state, dispatch } = useContext(NewChannelContext);
  const [modifying, setModifying] = useState(false);
  const previousChannelInfo = useRef<NewChannelState>(state);
  const [tfaCode, setTfaCode] = useState<string>("");
  const [tfaVerified, setTfaVerified] = useState<boolean>(false);
  const [verifyingTfa, setVerifyingTfa] = useState<boolean>(false);
  const [isReviewingChanges, setIsReviewingChanges] = useState<boolean>(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>("");

  useEffect(() => {
    dispatch({ type: 'IS_OWNER', userInfo: myProfile });
    dispatch({ type: 'IS_ADMIN', userInfo: myProfile });
  }, []);

  return (
    <div className='flex flex-col h-full'>
      <ChatNavbar
        title='channel info'
        backAction={backToChatroom}
        nextComponent={modifying ? <ChatButton title='save' onClick={saveChannelEdits} /> : <></>}
      />
      <div className='w-full h-full relative box-border overflow-y-scroll scrollbar-hide'>
        { state.isTryingToDeleteChannel && showDeleteChannelConfirmation() }
        { state.isInviting && showInviteList() }
        { isReviewingChanges && showChanges() }
        { verifyingTfa && showVerifyTFAForm() }
        { showEditChannelForm() }
        <div className='w-full h-full mt-6 relative'>
          <ChannelMemberList title="members" modifying={modifying}  isScrollable={false} />
        </div>
      </div>
    </div>
  )

  async function confirmDeleteChannel() {
    const deleteChannelResponse = await deleteChannel(chatroomData.channelId);

    if (deleteChannelResponse.status === 400) {
      return ;
    }
    dispatch({ type: 'RESET' });
    setChatBody(<ChatroomList />);
  }

  function showDeleteChannelConfirmation() {
    return (
      <div className='w-full h-full bg-dimshadow/70 absolute z-20'>
        <div className='top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-fit mx-auto absolute z-20 bg-dimshadow p-2 border-4 border-highlight rounded flex flex-col'>
        <button className='absolute border-dimshadow w-fit aspect-square border-2 hover:bg-highlight hover:text-dimshadow bg-dimshadow text-highlight rounded p-1' onClick={changedMyMind} ><FaTimes /></button>
          <div className='w-full h-fit p-4 flex flex-col items-center my-auto text-highlight gap-y-2'>
            { chatroomData.isPrivate ? <FaUserSecret className='text-3xl' /> : <ImEarth className='text-3xl' /> }
            <p className='text-lg font-extrabold'>{chatroomData.channelName}</p>
            <p className='text-sm'>Created by <span className='bg-accGreen px-[1ch] text-highlight'>{chatroomData.owner?.userName}</span></p>
            <p className='flex flex-row items-center uppercase gap-x-2 text-sm'><FaUsers /> {chatroomData.memberCount} members</p>
            {!state.deleteConfirmed && <button className='uppercase rounded p-2 px-[2ch] bg-dimshadow text-accRed font-bold border-2 border-accRed hover:bg-accRed hover:text-highlight mt-2 transition-all duration-100 hover:animate-h-shake' onClick={() => dispatch({ type: 'CONFIRM_DELETE_CHANNEL' })}>I want to delete this channel</button>}
            {state.deleteConfirmed && (
              <div className='gap-y-2 flex flex-col'>
                <p className='text-sm text-center text-highlight/50'>To confirm, type "<span className='text-highlight select-none'>{chatroomData.owner?.userName+`/`+chatroomData.channelName}</span>" in the box below</p>
                <input type="text" className='w-full h-full p-2 text-sm font-bold rounded border-2 border-accRed bg-dimshadow text-highlight outline-none text-center' value={deleteConfirmationText} onChange={handleDeleteConfirmationOnChange} />
                <button className={`${deleteConfirmationText === chatroomData.owner?.userName+`/`+chatroomData.channelName ? 'bg-accRed hover:text-accRed hover:bg-dimshadow cursor-pointer' : 'cursor-default border-highlight text-highlight opacity-25'} rounded border-2 p-2 border-accRed transition-all duration-100`} disabled={deleteConfirmationText !== chatroomData.owner?.userName+`/`+chatroomData.channelName} onClick={confirmDeleteChannel}>DELETE THIS CHANNEL</button>
              </div>
            )}
          </div>
        </div>
      </div>
    )

    function changedMyMind() {
      dispatch({ type: 'IS_TRYING_TO_DELETE_CHANNEL' });
      setDeleteConfirmationText("");
    }
  }

  function handleDeleteConfirmationOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDeleteConfirmationText(e.target.value);
  }

  function showChanges() {
    return (
      <div className='w-full h-full bg-dimshadow/70 absolute z-20'>
        <div className='top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[60%] mx-auto absolute flex z-20 bg-dimshadow p-2 border-4 border-highlight rounded'>
          <ChannelReviewChanges previousChannelInfo={previousChannelInfo.current} isReviewingChanges={isReviewingChanges} setIsReviewingChanges={setIsReviewingChanges} />
        </div>
      </div>
    )
  }

  function showInviteList() {

    const friendUserData = friends.map(friend => {
      return friend.sender.intraId === myProfile.intraId ? friend.receiver : friend.sender;
    });

    const friendsButNotMembers = friendUserData.filter(friend => {
      if (state.members.find(member => member.memberInfo.intraId === friend.intraId)) return false;
      return true;
    });

    return (
      <div className='w-full h-full bg-dimshadow/70 absolute z-20'>
        <div className='flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[90%] mx-auto absolute z-20 bg-dimshadow p-2 border-4 border-highlight rounded overflow-hidden'>
          <div className='relative mb-2 w-full flex flex-row justify-between items-center'>
            <button className='m-2 border-dimshadow w-fit aspect-square border-2 hover:bg-highlight hover:text-dimshadow bg-dimshadow text-highlight rounded p-1' onClick={() => dispatch({type: 'TOGGLE_IS_INVITING', isInviting: false})} ><FaTimes /></button>
            {state.inviteList.length > 0 && <button className='border-2 border-highlight bg-dimshadow text-highlight hover:text-dimshadow hover:bg-highlight font-extrabold rounded text-sm p-1.5 h-fit' onClick={sendInvites}>SEND INVITES ({state.inviteList.length})</button>}
          </div>
          { friendsButNotMembers.length === 0
            ? (
              <div className='w-full h-full relative'>
                <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-extrabold text-highlight'>{ friendUserData.length === 0 ? 'No friends to choose from...' : 'All you friends are in this channel already!' }</p>
              </div>
            ) :
            (
              <div className='overflow-y-scroll'>
                <ChannelMemberList title='friend' friendList={friendsButNotMembers} viewingInviteList={true} />
              </div>
            )
          }
        </div>
      </div>
    )
  }

  function showVerifyTFAForm() {

    const [opacity, setOpacity] = useState<number>(0);

    useEffect(() => {
      setOpacity(100);
    }, []);

    return (
      <>
        {
          myProfile.tfaSecret?.toLowerCase() === "enabled" &&
          <div className='h-full w-full absolute bg-dimshadow/90 z-10 transition-opacity duration-500' style={{opacity: `${opacity}`}}>
            <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <div className='h-fit w-fit flex flex-col bg-dimshadow p-4 border-4 border-highlight rounded m-auto font-extrabold'>
                <UserFormTfa invert tfaCode={tfaCode} setTfaCode={setTfaCode} tfaVerified={tfaVerified} setTFAVerified={setTfaVerified} handleSubmit={() => console.log("yo")} />
                <button className='text-accRed hover:text-highlight bg-dimshadow p-2 rounded border-accRed border-2 hover:bg-accRed' onClick={() => setVerifyingTfa(false)}>cancel</button>
              </div>
            </div>
          </div>
        }
      </>
    )
  }

  function showEditChannelForm() {
    return (
      <>
        <ChannelInfoForm currentChannelData={chatroomData} isReviewingChanges={isReviewingChanges} setIsReviewingChanges={setIsReviewingChanges} modifying={modifying} setModifyChannel={modifyChannel} />
      </>
    )
  }

  function modifyChannel() {
    setModifying(!modifying);
  }

  function backToChatroom() {
    dispatch({ type: 'CLONE_STATE', state: previousChannelInfo.current });
    setChatBody(<ChatroomContent chatroomData={chatroomData} />);
  }

  async function sendInvites() {
    const { inviteList } = state;
    const inviteErrors: number[] = [];

    for (const invite of inviteList) {
      const inviteResponse = await inviteMemberToChannel({
        channelId: chatroomData.channelId,
        intraName: invite.memberInfo.intraName,
        isAdmin: false,
        isBanned: false,
        isMuted: false,
        password: null,
      })
      if (inviteResponse.status !== 201) {
        inviteErrors.push(invite.memberInfo.intraId);
      } else {
        dispatch({ type: 'SELECT_MEMBER', userInfo: (inviteResponse.data as MemberData).user});
      }
    }
    dispatch({ type: 'RESET_INVITE_LIST' });
    dispatch({type: 'TOGGLE_IS_INVITING', isInviting: false})
  }

  async function saveChannelEdits() {
    const { channelName, password, newPassword, isPrivate } = state;
    let errorCount = 0;

    dispatch({ type: 'RESET_ERRORS' });

    if (!(channelName.length > 0 && channelName.length <= 16)) {
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_CHANNEL_NAME });
      errorCount++;
    }

    if (isPrivate && previousChannelInfo.current.password !== null && password !== null && !(password.length > 0 && password.length <= 16)) {
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_PASSWORD });
      errorCount++;
    }

    // when switch to public and is set to password protected, check password validity
    if (!isPrivate && password !== null && !(password.length > 0 && password.length <= 16)) {
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_PASSWORD });
      errorCount++;
    }

    if (!isPrivate && newPassword !== null && !(newPassword.length > 0 && newPassword.length <= 16)) {
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_NEW_PASSWORD });
      errorCount++;
    }

    if (errorCount !== 0) return;

    const updatedChannelInfo: UpdateChannelData = {
      channelId: chatroomData.channelId,
      channelName: channelName,
      oldPassword: password,
      newPassword: state.newPassword,
      isPrivate: isPrivate,
    }

    const updateChannelResponse = await updateChannel(updatedChannelInfo);

    if (updateChannelResponse.status === 200) {

      if ((updateChannelResponse.data as ErrorData).error) {
        dispatch({ type: 'ADD_ERROR', error: NewChannelError.WRONG_PASSWORD });
        return ;
      }
      dispatch({ type: 'RESET' });
      setChatBody(<ChatroomContent chatroomData={(updateChannelResponse.data as ChatroomData)} />);
    }
  }
}

export default ChannelInfo