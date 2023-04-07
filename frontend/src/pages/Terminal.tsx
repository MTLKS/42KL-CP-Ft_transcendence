import React from 'react'
import PromptField from '../PromptField/PromptField'
import SrcollView from '../components/SrcollView'

function Terminal() {
  return (
    <div className='h-screen flex flex-col'>
      <SrcollView>
        <p className='text-gray-300 text-4xl tracking-tighter mb-5 text-center h-15'>Welcome to the terminal</p>
        <p className='text-gray-300 text-4xl tracking-tighter mb-5 text-center h-15'>Welcome to the terminal</p>
      </SrcollView>
      <PromptField />
    </div>
  )
}

export default Terminal