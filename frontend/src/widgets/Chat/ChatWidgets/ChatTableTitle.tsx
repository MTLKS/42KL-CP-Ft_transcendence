import React from 'react'
import ChatSearchBar from './ChatSearchBar';

interface ChatTableTitleProps {
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
}

function ChatTableTitle(props: ChatTableTitleProps) {

  const { title, searchable, filterable } = props;

  return (
    <div className='flex flex-row justify-between items-center'>
      <p className='text-sm text-highlight/50 capitalize'>{title}</p>
      <div className='flex flex-row'>
        {filterable && <>sdf</>}
        {searchable && <ChatSearchBar invert={true} />}
      </div>
    </div>
  )
}

export default ChatTableTitle