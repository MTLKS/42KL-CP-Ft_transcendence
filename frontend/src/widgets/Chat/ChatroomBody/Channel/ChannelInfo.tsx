import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChannelMemberList from './ChannelMemberList'
import ChatButton from '../../ChatWidgets/ChatButton'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext'
import ChatroomContent from '../Chatroom/ChatroomContent'
import ChannelInfoForm from './ChannelInfoForm'
import { ChatroomData } from '../../../../model/ChatRoomData'
import { NewChannelState } from './newChannelReducer'
import UserContext from '../../../../contexts/UserContext'
import UserFormTfa from '../../../../pages/UserForm/UserFormTfa'
import ChannelReviewChanges from './ChannelReviewChanges'

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

  function saveChannelEdits() {
    console.log("channel info: ", state);
  }
}

export default ChannelInfo