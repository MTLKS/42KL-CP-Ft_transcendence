import React, { useContext, useEffect, useMemo, useReducer } from 'react'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import ChatButton from '../../ChatWidgets/ChatButton'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatMember from '../ChatMember'
import { FriendsContext } from '../../../../contexts/FriendContext'
import { ChatContext, ChatroomsContext, NewChatContext } from '../../../../contexts/ChatContext'
import ChatroomList from '../Chatroom/ChatroomList'
import newChatRoomReducer, { newChatRoomInitialState } from './newChatRoomReducer'
import NewChatInfo from './NewChatInfo'
import UserContext from '../../../../contexts/UserContext'

interface NewChatRoomProps {
  chatrooms?: TemporaryChatRoomData[],
  type: 'dm' | 'channel'
}

function NewChatRoom(props: NewChatRoomProps) {

  // Props
  const { chatrooms, type } = props;

  const [state, dispatch] = useReducer(newChatRoomReducer, newChatRoomInitialState);
  const { myProfile } = useContext(UserContext);
  const { setChatBody } = useContext(ChatContext);
  const { friends } = useContext(FriendsContext);
  const acceptedFriends = useMemo(() => friends.filter(friend => friend.status.toLowerCase() === 'accepted'), [friends]);

  useEffect(() => {
    dispatch({ type: 'SET_IS_CHANNEL', payload: type === 'channel' });
  }, []);

  return (
    <NewChatContext.Provider value={{ members: state.members }}>
      <div className='w-full h-full'>
        <ChatNavbar
          title={`new ${type}`}
          nextComponent={<ChatButton title={type === "dm" ? "create" : `next (${state.members && state.members.length})`} onClick={type === "dm" ? handleCreateChatroom : () => setChatBody(<NewChatInfo />)} />}
          backAction={() => setChatBody(<ChatroomList />)}
        />
        <div className='w-[95%] h-full mx-auto flex flex-col gap-y-2'>
          <ChatTableTitle title={`friends (${acceptedFriends.length})`} searchable={true} />
          { type === 'dm' && <p className='text-sm text-highlight/50'>Select one friend to chat:</p> }
          <div className='w-full h-full overflow-y-scroll flex flex-col gap-y-2.5'>
            {state.members && acceptedFriends.map(friend => (<ChatMember key={friend.id} friend={friend} toggleMember={handleToggleMember}/>))}
          </div>
        </div>
      </div>
    </NewChatContext.Provider>
  )

  function handleToggleMember(intraName: string): boolean {
    if (state.members.includes(intraName)) {
      dispatch({ type: 'DESELECT_MEMBER', payload: intraName });
      return false;
    } else {
      dispatch({ type: 'SELECT_MEMBER', payload: intraName });
      return true;
    }
  }

  function handleCreateChatroom() {

    // if no friend is selected, do nothing
    if (state.members.length === 0) return;

    // if chatroom already existed, do nothing
    const chatroomExisted = chatrooms?.some(chatroom => chatroom.intraName === state.members[0] && chatroom.type === 'dm');
    // if (chatroomExisted) {
    //   setChatBody(<ChatroomList />);
    //   return;
    // }

    const currentDateISOString = new Date().toISOString();
    // currently only consider DM
    const tempChatRoom: TemporaryChatRoomData = {
      intraName: state.members[0], // only one member
      createdAt: currentDateISOString,
      type: type,
    }
    localStorage.setItem(`${myProfile.intraId.toString()}_tcr_${currentDateISOString}`, JSON.stringify(tempChatRoom));
    setChatBody(<ChatroomList />);
  }
}

export default NewChatRoom