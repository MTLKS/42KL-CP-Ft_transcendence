import React from 'react'
import ChatTableTitle from '../../ChatWidgets/ChatTableTitle'
import ChatNavbar from '../../ChatWidgets/ChatNavbar'
import Channel from './Channel'

function ChannelList() {
  return (
    <div className='text-highlight w-full h-full'>
      <ChatNavbar title="channel list" />
      <div className='mx-10 gap-y-4 h-full'>
        <ChatTableTitle title='channels (4)' searchable={true} />
        <div className='h-full w-full overflow-y-scroll'>
          {/** The channel list */}
          <Channel />
        </div>
      </div>
    </div>
  )
}

export default ChannelList