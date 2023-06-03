import React, { useContext, useEffect, useState } from 'react'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import Channel from './Channel'
import { ChatContext } from '../../../../contexts/ChatContext';
import ChatroomList from '../Chatroom/ChatroomList';
import { getAllPublicChannels } from '../../../../api/chatAPIs';
import { ChatroomData } from '../../../../model/ChatRoomData';
import { FaSadCry } from 'react-icons/fa';

const CHANNEL_FETCH_LIMIT = 20;

function ChannelList() {

  const { setChatBody } = useContext(ChatContext);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [channelComponents, setChannelComponents] = useState<JSX.Element[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getPublicChannels();
  }, []);

  return (
    <div className='flex flex-col flex-1 h-0 border-box text-highlight'>
      <ChatNavbar title="channel list" backAction={() => setChatBody(<ChatroomList />)} />
      <div className='relative w-full h-full px-10 overflow-y-scroll scrollbar-hide'>
        { 
          channelComponents.length > 0
          ? <>
              <div className='sticky top-0 z-50'>
                <ChatTableTitle title='channels' searchable={true} setFilterKeyword={setFilterKeyword} />
              </div>
              <div className='w-full h-full -z-10'>
                {channelComponents}
              </div>
            </>
          : emptyChannelList()
        }
      </div>
    </div>
  )

  function emptyChannelList() {
    return (
      <div className='absolute flex flex-col items-center -translate-x-1/2 gap-y-2 w-fit -translate-y-1/3 top-1/3 left-1/2'>
        <span className='w-full text-center'>There's no channel for you to join right now...</span>
        <FaSadCry className='text-xl'/>
      </div>
    )
  }

  async function getPublicChannels() {
    const channels = (await getAllPublicChannels(CHANNEL_FETCH_LIMIT, page)).data as ChatroomData[];
    const channelComponents = channels.map((channel) => {
      return <Channel key={channel.channelId} channelInfo={channel} />
    });
    setChannelComponents(channelComponents);
  }
}

export default ChannelList