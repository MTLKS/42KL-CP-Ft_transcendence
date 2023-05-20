import React, { useContext, useEffect, useMemo, useReducer, useState } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChatButton from '../../ChatWidgets/ChatButton'
import { FriendsContext } from '../../../../contexts/FriendContext'
import { ChatContext, NewChannelContext } from '../../../../contexts/ChatContext'
import ChatroomList from '../Chatroom/ChatroomList'
import newChannelReducer, { NewChannelAction, NewChannelState, newChannelInitialState } from './newChannelReducer'
import NewChatInfo from './NewChatInfo'
import UserContext from '../../../../contexts/UserContext'
import { UserData } from '../../../../model/UserData'
import { FriendData } from '../../../../model/FriendData'
import ChannelMemberList from './ChannelMemberList'

interface NewChannelProps {
  oldState?: NewChannelState,
}

function NewChannel(props: NewChannelProps) {

  const { oldState } = props;
  const [state, dispatch] = useReducer(newChannelReducer, oldState || newChannelInitialState);
  const { setChatBody } = useContext(ChatContext);
  const { myProfile } = useContext(UserContext);
  const { friends } = useContext(FriendsContext);
  const [toNextStep, setToNextStep] = useState(false);
  const acceptedFriendsUserData = useMemo(() => {
    const acceptedFriends: FriendData[] = friends.filter(friend => friend.status.toLowerCase() === 'accepted');
    const friendsUserData: UserData[] = acceptedFriends.map(friend => (myProfile.intraName === friend.sender.intraName ? friend.receiver : friend.sender));
    return friendsUserData;
  }, [friends]);

  useEffect(() => {
    if (state.members.find(member => member.memberInfo.intraName === myProfile.intraName) === undefined) {
      dispatch({ type: 'SELECT_MEMBER', userInfo: myProfile });
    }
  }, []);

  useEffect(() => {
    if (toNextStep) {
      setChatBody(
        <NewChannelContext.Provider value={{ state, dispatch }}>
          <NewChatInfo />
        </NewChannelContext.Provider>
      );
    }
  }, [toNextStep]);

  return (
    <div className='w-full h-full'>
      <ChatNavbar
        title={`new channel`}
        nextComponent={
          <ChatButton
            title={state.members && (state.members.length === 1 ? `skip` : `next (${state.members.length - 1})`)}
            onClick={goToNextStep}
          />
        }
        backAction={() => setChatBody(<ChatroomList />)}
      />
      {acceptedFriendsUserData.length > 0 ? <ChannelMemberList state={state} dispatch={dispatch} title='friends' friendList={acceptedFriendsUserData} isUsingOldState={oldState !== undefined} /> : displayNoFriends()}
    </div>
  )

  // TODO: DO ME
  function displayNoFriends() {
    return (
      <div className='uppercase w-full h-full'>
        <p className='w-fit h-fit bg-accRed m-auto py-6 px-5'>No friends to choose from</p>
      </div>
    )
  }

  function goToNextStep() {
    dispatch({ type: 'ASSIGN_AS_OWNER', intraName: myProfile.intraName });
    setToNextStep(true);
  }
}

export default NewChannel