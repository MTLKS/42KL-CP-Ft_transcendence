import React from 'react'
import Triangle from '../components/Triangle'


function Profile() {
  return (
    <div className='w-full bg-highlight py-1 flex flex-row items-center'>
      <img className=' aspect-square w-20'
        style={{ imageResolution: '10dpi', imageRendering: 'pixelated' }}
        src='https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*' />
      <div className='flex flex-col justify-center mx-5'>
        <div className=' text-2xl text-dimshadow font-extrabold'>JOHNDOE</div>
        <div className=' text-xs text-dimshadow'>THE BLACKHOLE DESTROYER</div>
      </div>
      <div className=' bg-dimshadow w-1 h-16 mr-5' />
      <div className=' bg-dimshadow w-10 h-10 mr-auto' />

      <div className='relative w-20 h-10 mx-5'>
        <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-dimshadow text-4xl font-extrabold z-10'
          style={{ textShadow: '-2px 0 0 #fef8e2, 0 2px 0 #fef8e2, 2px 0 0  #fef8e2, 0 -2px 0 #fef8e2' }}
        >
          420
        </div>
        <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Triangle color='dimshadow' h={65} w={75} direction='top' />
        </div>
      </div>
    </div>
  )
}

export default Profile