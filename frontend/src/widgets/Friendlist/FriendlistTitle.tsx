import React from 'react'
import FriendlistSeparator from './FriendlistSeparator'
import { TabWidth } from './FriendlistConfig'
import Highlighter from '../../components/Highlighter';

interface FriendlistTitleProp {
  searchTerm?: string;
}

function FriendlistTitle(props: FriendlistTitleProp) {

  const { searchTerm } = props;

  return (
    <div className='flex flex-row text-highlight'>
      <div className={`w-[${TabWidth.nickname}ch]`}>
        <Highlighter key="nickname" text={"nickname"} searchTerm={searchTerm}/>
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.intraName}ch]`}>
        <Highlighter key="intraname" text={"intra name"} searchTerm={searchTerm}/>
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.eloScore}ch] flex flex-row`}>
        <Highlighter key="elo" text={"elo"} searchTerm={searchTerm}/>
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.relationship}ch]`}>
        <Highlighter key="relationship" text={"relationship"} searchTerm={searchTerm}/>
      </div>
      <FriendlistSeparator />
      <div className={`w-[${TabWidth.status}ch]`}>
        <Highlighter key="status" text={"status"} searchTerm={searchTerm}/>
      </div>
    </div>
  )
}

export default FriendlistTitle