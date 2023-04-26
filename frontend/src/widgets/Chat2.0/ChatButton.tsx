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
      className={`flex flex-row bg-highlight rounded p-2 w-fit h-fit ${title !== undefined && 'gap-x-2'} items-center cursor-pointer`}
      onClick={onClick}
    >
      {icon}
      <p className='uppercase font-extrabold text-md text-dimshadow'>{title}</p>
    </div>
  )
}

export default ChatButton