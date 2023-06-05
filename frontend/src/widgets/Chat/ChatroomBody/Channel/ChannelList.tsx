import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import Channel from './Channel'
import { ChatContext } from '../../../../contexts/ChatContext';
import ChatroomList from '../Chatroom/ChatroomList';
import { getAllPublicChannels } from '../../../../api/chatAPIs';
import { ChatroomData } from '../../../../model/ChatRoomData';
import { FaEye, FaFlushed, FaHandPaper, FaSadCry, FaTimes } from 'react-icons/fa';

const CHANNEL_FETCH_LIMIT = 10;

function ChannelList() {

  const { setChatBody } = useContext(ChatContext);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [channelComponents, setChannelComponents] = useState<JSX.Element[]>([]);
  const [page, setPage] = useState<number>(1);
  const [askForPassword, setAskForPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [canBeFetched, setCanBeFetched] = useState<boolean>(true);
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPublicChannels();

    const scrollableDiv = scrollableDivRef.current;
    scrollableDiv?.addEventListener('scroll', handleScrollToBottom);

    return () => {
      scrollableDiv?.removeEventListener('scroll', handleScrollToBottom);
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) getPublicChannels();
  }, [isAtBottom]);

  return (
    <div className='flex flex-col flex-1 h-0 border-box text-highlight'>
      <ChatNavbar title="channel list" backAction={() => setChatBody(<ChatroomList />)} />
      <div className='relative w-full h-full px-10 overflow-y-scroll scrollbar-hide' ref={scrollableDivRef}>
        { 
          channelComponents.length > 0
          ? <>
              <div className='sticky top-0 z-10 bg-dimshadow'>
                <ChatTableTitle title={`channels (${channelComponents.length})`} searchable={true} setFilterKeyword={setFilterKeyword} />
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

  async function handleScrollToBottom() {
    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAtBottom(isAtBottom);
    }
  }
  
  function emptyChannelList() {
    return (
      <div className='absolute flex flex-col items-center -translate-x-1/2 gap-y-2 w-fit -translate-y-1/3 top-1/3 left-1/2'>
        <span className='w-full text-center'>There's no channel for you to join right now...</span>
        <FaSadCry className='text-xl'/>
      </div>
    )
  }

  async function getPublicChannels() {

    if (!canBeFetched) return;

    const channels = (await getAllPublicChannels(CHANNEL_FETCH_LIMIT, page)).data as ChatroomData[];
    if (channels.length < CHANNEL_FETCH_LIMIT) {
      setCanBeFetched(false);
    }
    const newChannelComponents = channels.map((channel) => {
      return <Channel key={channel.channelId} channelInfo={channel} />
    });
    setChannelComponents([...channelComponents, ...newChannelComponents]);
    setPage(page + 1);
  }
}

export default ChannelList