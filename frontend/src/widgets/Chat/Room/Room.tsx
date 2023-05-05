import React, { useEffect } from 'react'
import RoomHeader from './RoomHeader';
import Messages from './Messages';
import PromptField from '../../../components/PromptField';

interface RoomProps {
  roomData: ChatRoomData;
  closeChat: () => void;
}

function Room(props: RoomProps) {
  const { roomData, closeChat } = props;
  const { name } = roomData;
  const promptFieldRef = React.useRef<any>(null);

  useEffect(() => {
    promptFieldRef.current?.focusOnInput();
  }, []);

  return (
    <div className='flex flex-col box-border flex-1 h-0'
      onClick={() => promptFieldRef.current?.focusOnInput()}
    >
      <RoomHeader roomData={roomData} closeChat={closeChat} />
      <Messages recieverId='2' />
      <div className=' bg-highlight h-1 w-full' />
      <PromptField handleCommands={handleCommands} center={false} availableCommands={[]}
        errorClassName={''} wrap ref={promptFieldRef}
      />
    </div>
  )

  function handleCommands(commands: string[], string: string) {
  }
}

export default Room