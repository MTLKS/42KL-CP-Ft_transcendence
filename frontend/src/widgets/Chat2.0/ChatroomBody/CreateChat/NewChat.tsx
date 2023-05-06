import React from 'react'
import ChatNavbar from '../../ChatNavbar'
import ChatButton from '../../ChatButton'
import ChatTableTitle from '../../ChatTableTitle'
import ChatMember from '../ChatMember'

function NewChat() {
  return (
    <div className='w-full h-full'>
      <ChatNavbar title='new chat' nextComponent={<ChatButton title='create' />} />
      <div className='w-[95%] h-full mx-auto'>
        <ChatTableTitle title='friends (4)' searchable={true} />
        <div className='w-full h-full overflow-y-scroll flex flex-col gap-y-2.5'>
          <ChatMember />
        </div>
      </div>
    </div>
  )
}

export default NewChat