import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChannelMemberList from './ChannelMemberList'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext'
import ChatroomContent from '../Chatroom/ChatroomContent'
import ChannelInfoForm from './ChannelInfoForm'
import { ChatroomData, UpdateChannelData } from '../../../../model/ChatRoomData'
import { NewChannelError, NewChannelState } from './newChannelReducer'
import UserContext from '../../../../contexts/UserContext'
import UserFormTfa from '../../../../pages/UserForm/UserFormTfa'
import ChannelReviewChanges from './ChannelReviewChanges'
import { updateChannel } from '../../../../api/chatAPIs'
import { ErrorData } from '../../../../model/ErrorData'
import { FriendsContext } from '../../../../contexts/FriendContext'
import { UserData } from '../../../../model/UserData'
import { FaTimes } from 'react-icons/fa'

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

  useEffect(() => {
    dispatch({ type: 'IS_OWNER', userInfo: myProfile});
  }, []);

  return (
    <div className='flex flex-col h-full'>
      <ChatNavbar
        title='channel info'
        backAction={backToChatroom}
        nextComponent={modifying ? <ChatButton title='save' onClick={saveChannelEdits} /> : <></>}
      />
      <div className='w-full h-full relative box-border'>
        { state.isInviting && showInviteList() }
        { isReviewingChanges && showChanges() }
        { verifyingTfa && showVerifyTFAForm() }
        { showEditChannelForm() }
        <div className='w-full h-full mt-6'>
          <ChannelMemberList title="members" modifying={modifying} />
        </div>
      </div>
    </div>
  )

  function showChanges() {
    return (
      <div className='w-full h-full bg-dimshadow/70 absolute z-10'>
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
      <div className='w-full h-full bg-dimshadow/70 absolute z-10'>
        <div className='flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[90%] mx-auto absolute z-20 bg-dimshadow p-2 border-4 border-highlight rounded'>
          <button className='m-2 border-dimshadow w-fit border-2 hover:bg-highlight hover:text-dimshadow aspect-square bg-dimshadow text-highlight rounded p-1' onClick={() => dispatch({type: 'TOGGLE_IS_INVITING', isInviting: false})} ><FaTimes /></button>
          { friendsButNotMembers.length === 0
            ? (
              <div className='w-full h-full relative'>
                <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-extrabold text-highlight'>{ friendUserData.length === 0 ? 'No friends to choose from...' : 'All you friends are in this channel already!' }</p>
              </div>
            ) :
            (<ChannelMemberList title='friend' friendList={friendsButNotMembers} viewingInviteList={true} />)
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