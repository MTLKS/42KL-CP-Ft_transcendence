import React from 'react'
import Highlighter from '../../components/Highlighter';

interface FriendlistTagType {
  type: string;
  total?: number;
  searchTerm?: string;
}

const getFriendTagStyle = (type: string) => {
  let bgColor = `bg-dimshadow`, textColor = `text-highlight`;

  type = type.toLowerCase();
  if (type === "friend") {
    bgColor = `bg-highlight`;
    textColor = `text-dimshadow`;
  }
  else if (type === "accepted")
    bgColor = `bg-accCyan`;
  else if (type === "incoming" || type === "outgoing" || type === "pending")
    bgColor = `bg-accYellow`;
  else if (type === "blocked")
    bgColor = `bg-accRed`;
  return (`${bgColor} ${textColor}`);
}

function FriendlistTag(props: FriendlistTagType) {

  let style, width;
  const { type, total, searchTerm } = props;

  style = getFriendTagStyle(type);
  width = type.length;
  return (
    <div className='flex flex-row gap-x-[1ch]'>
      <div className={`${style} text-center w-fit uppercase px-[1ch]`}>
        <>
          <Highlighter text={type} searchTerm={searchTerm}/>
          {total !== undefined ? <span className='text-highlight/50 whitespace-pre'>  {total}</span> : ''}
        </>
      </div>
    </div>
  )
}

export default FriendlistTag