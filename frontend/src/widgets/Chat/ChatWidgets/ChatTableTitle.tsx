import React, { useContext } from 'react'
import ChatSearchBar from './ChatSearchBar';
import { NewChannelContext } from '../../../contexts/ChatContext';

interface ChatTableTitleProps {
  title?: string;
  searchable?: boolean;
  setFilterKeyword: React.Dispatch<React.SetStateAction<string>>;
}

function ChatTableTitle(props: ChatTableTitleProps) {

  const { state } = useContext(NewChannelContext); 
  const { title, searchable, setFilterKeyword } = props;

  return (
    <div className='flex flex-row justify-between items-center'>
      <p className='text-sm text-highlight/50 capitalize'>{title}</p>
      <div className='flex flex-row'>
        {!state.isNewChannel && <button className='uppercase w-full h-full border-2 border-highlight mr-2 rounded text-sm p-2 font-extrabold bg-highlight hover:bg-dimshadow text-dimshadow hover:text-highlight'>Manage</button>}
        {searchable && <ChatSearchBar invert={true} setFilterKeyword={setFilterKeyword}/>}
      </div>
    </div>
  )
}

export default ChatTableTitle