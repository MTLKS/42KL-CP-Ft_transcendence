import React from 'react'

interface FriendlistTagType {
  type: string;
}

const getFriendTagStyle = (type: string) => {
  let bgColor = `bg-dimshadow`, textColor = `text-highlight`;

  type = type.toLowerCase();
  if (type === "friend") {
    bgColor = `bg-highlight`;
    textColor = `text-dimshadow`;
  }
  else if (type === "muted")
    bgColor = `bg-accCyan`;
  else if (type === "pending")
    bgColor = `bg-accYellow`;
  else if (type === "blocked")
    bgColor = `bg-accRed`;
  return (`${bgColor} ${textColor}`);
}

function FriendlistTag(props: FriendlistTagType) {

  let style, width;
  const { type } = props;

  style = getFriendTagStyle(type);
  width = type.length;
  return (
    <p
      className={`${style} text-center w-fit uppercase px-[1ch]`}
    >
      {type}
    </p>
  )
}

export default FriendlistTag