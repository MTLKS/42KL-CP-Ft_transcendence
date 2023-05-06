import React from 'react'

interface ChatButtonProps {
  icon?: React.ReactNode;
  title?: string;
  onClick?: () => void;
}

function ChatButton(props: ChatButtonProps) {

  const { icon, title, onClick } = props;

  return (
    <div
      className={`flex flex-row bg-highlight rounded p-2 w-fit h-fit ${title !== undefined && 'gap-x-2'} items-center cursor-pointer group hover:bg-dimshadow border-2 border-highlight transition-all duration-200`}
      onClick={onClick}
    >
      <p className='group-hover:text-highlight text-dimshadow text-lg'>{icon}</p>
      <p className='uppercase font-extrabold text-md text-dimshadow group-hover:text-highlight'>{title}</p>
    </div>
  )
}

export default ChatButton