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

interface ChannelInfoProps {
  chatroomData: ChatroomData;
}

function ChannelInfo(props: ChannelInfoProps) {

  const { chatroomData } = props;
  const { myProfile } = useContext(UserContext);
  const { setChatBody } = useContext(ChatContext);
  const { state, dispatch } = useContext(NewChannelContext);
  const [modifying, setModifying] = useState(false);
  const previousChannelInfo = useRef<NewChannelState>(state);
  const [tfaCode, setTfaCode] = useState<string>("");
  const [tfaVerified, setTfaVerified] = useState<boolean>(false);
  const [verifyingTfa, setVerifyingTfa] = useState<boolean>(false);
  const [isReviewingChanges, setIsReviewingChanges] = useState<boolean>(false);

  useEffect(() => {
    console.log(chatroomData);
  }, []);

  return (
    <div className='flex flex-col h-full'>
      <ChatNavbar
        title='channel info'
        backAction={backToChatroom}
        nextComponent={modifying ? <ChatButton title='save' onClick={saveChannelEdits} /> : <></>}
      />
      <div className='w-full h-full relative box-border'>
        { isReviewingChanges && showChanges() }
        { verifyingTfa && showVerifyTFAForm() }
        { showEditChannelForm() }
      </div>
    </div>
  )

  function showChanges() {
    return (
      <div className='top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[90%] mx-auto absolute flex z-20 bg-dimshadow p-2 border-4 border-highlight rounded'>
        <ChannelReviewChanges previousChannelInfo={previousChannelInfo.current} isReviewingChanges={isReviewingChanges} setIsReviewingChanges={setIsReviewingChanges} />
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
        <ChannelInfoForm isReviewingChanges={isReviewingChanges} setIsReviewingChanges={setIsReviewingChanges} modifying={modifying} setModifyChannel={modifyChannel} />
        <div className='w-full h-full mt-6'>
          <ChannelMemberList title="members" />
        </div>
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

    /**
     * Try these scenarios:
     * 1. Public
     *  - change name only [ok, oldpassword and newpassword should both be null]
     *  - enable password [ok, oldpassword and newpassword should be the same]
     *  - disable password [ok, oldpassword is previous password, newpassword is null]
     *  - public to private [ok, oldpassword and newpassword should be null]
     * 
     * 2. Private
     *  - change name only [ok]
     *  - switch to public, no password [ok]
     *  - switch to public, with password [ok]
     *  - switch back to private
     * 
     * 3. Protected
     *   - change name only [ok]
     *   - change password [ok]
     *   - disable pasword (public) [ok]
     *   - switch to private
     * 
     * 4. Error handling
     *  - channel name [ok]
     *  - password & new password [ok]
     *  - switch between public, protected and private [ok]
     *  - wrong password (protected)
     */

    dispatch({ type: 'RESET_ERRORS' });

    if (!(channelName.length > 0 && channelName.length <= 16)) {
      console.log("invalid channel name");
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_CHANNEL_NAME });
      errorCount++;
    }
    
    if (!isPrivate && password !== null && !(password.length > 0 && password.length <= 16)) {
      console.log("invalid password");
      dispatch({ type: 'ADD_ERROR', error: NewChannelError.INVALID_PASSWORD });
      errorCount++;
    }

    if (!isPrivate && newPassword !== null && !(newPassword.length > 0 && newPassword.length <= 16)) {
      console.log("invalid new password");
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

    console.log("updated channel info: ", updatedChannelInfo);

    const updateChannelResponse = await updateChannel(updatedChannelInfo);
    
    console.log(updateChannelResponse.data);
    // return ;
    if (updateChannelResponse.status === 200) {
      dispatch({ type: 'RESET' });
      setChatBody(<ChatroomContent chatroomData={(updateChannelResponse.data as ChatroomData)} />);
    }
  }
}

export default ChannelInfo