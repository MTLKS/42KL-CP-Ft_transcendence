import React from 'react'

interface ChatSearchbarProps {
  invert: boolean;
}

function ChatSearchBar(props: ChatSearchbarProps) {

  const { invert = false } = props;

  let style = (invert)
    ? `placeholder:text-dimshadow/20 bg-highlight text-dimshadow`
    : `placeholder:text-highlight/20 bg-dimshadow text-highlight`;

  return (
    <input
      className={`${style} px-2 py-1.5 font-normal rounded outline-none text-sm  cursor-text`}
      type='text'
      autoComplete='off'
      placeholder='search...'
      onClick={e => e.stopPropagation()}
    />
  )
}

export default ChatSearchBar