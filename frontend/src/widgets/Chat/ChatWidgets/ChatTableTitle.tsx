import React from 'react'
import ChatSearchBar from './ChatSearchBar';


interface ChatTableTitleProps {
  title?: string;
  searchable?: boolean;
  setFilterKeyword: React.Dispatch<React.SetStateAction<string>>;
}

function ChatTableTitle(props: ChatTableTitleProps) {

  const { title, searchable, setFilterKeyword } = props;

  return (
    <div className='flex flex-row items-center justify-between'>
      <p className='text-sm capitalize text-highlight/50'>{title}</p>
      <div className='flex flex-row'>
        {searchable && <ChatSearchBar invert={true} setFilterKeyword={setFilterKeyword}/>}
      </div>
    </div>
  )
}

export default ChatTableTitle