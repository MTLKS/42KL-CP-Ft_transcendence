import React from 'react'
import ChatNavbar from '../../ChatNavbar'
import ChatButton from '../../ChatButton'

function NewChatInfo() {
  return (
    <div className='flex flex-col'>
      <ChatNavbar title='channel info' nextComponent={<ChatButton title='create' />} />
    </div>
  )
}

export default NewChatInfo