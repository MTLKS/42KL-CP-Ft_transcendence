import React, { useEffect, useState } from 'react'
import Triangle from '../components/Triangle'
import PixelatedImage from '../components/PixelatedImage'
import sleep from '../functions/sleep';


function Profile() {
  const [pixelSize, setPixelSize] = useState(400);
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
    if (pixelSize == 400)
      pixelatedToSmooth();
  }, []);

  return expanded ? (<div className='w-full bg-highlight flex flex-col items-center'
    onClick={onProfileClick}
  >
    <div className='flex flex-row w-full mb-1'>
      <div className='flex flex-col w-full justify-center  bg-dimshadow px-5 mr-1'>
        <div className=' text-2xl text-highlight font-extrabold'>JOHNDOE (jdoe)</div>
        <div className=' text-xs text-highlight'>THE BLACKHOLE DESTROYER</div>
      </div>
      <div className=' bg-dimshadow w-20 aspect-square '>
        <div className=' bg-highlight w-10 h-10 m-auto' />
      </div>
    </div>
    <div className=' flex flex-row w-full mb-1'>
      <div className='flex-1 mr-1 bg-dimshadow'>
        <PixelatedImage src='../../assets/download.png' pixelSize={pixelSize} className='w-full' />
      </div>
      <div className='mr-1 bg-dimshadow flex-1'>
        <div className='relative w-full h-full'>
          <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-highlight text-6xl font-extrabold z-10'
            style={{ textShadow: '-5px 0 0 #242424, 0 5px 0 #242424, 5px 0 0  #242424, 0 -5px 0 #242424' }}
          >
            420
          </div>
          <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <Triangle color='fill-highlight' h={100} w={120} direction='top' />
          </div>
        </div>
      </div>
      <div className='flex-1 flex flex-col'>
        <div className=' bg-dimshadow h-full flex flex-col justify-center items-center text-highlight font-bold text-sm'>
          <div>Win: 20</div>
          <div>lose: 20</div>
          <div>MY WORST NIGHTMARE</div>
          <div>MY PUNCHING BAG</div>
        </div>
        <div className=' text-center p-2 font-extrabold'>
          STATS
        </div>
      </div>
    </div>
    <div className=' bg-dimshadow mb-1 h-60 w-full'>

    </div>
  </div>) : (
    <div className='w-full bg-highlight py-1 flex flex-row items-center'
      onClick={onProfileClick}
    >
      <PixelatedImage src='../../assets/download.png' pixelSize={pixelSize} className=' w-20 aspect-square' />
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
          <Triangle color='fill-dimshadow' h={65} w={75} direction='top' />
        </div>
      </div>
    </div>
  )

  async function pixelatedToSmooth(start: number = 400) {
    let tmp = start;
    while (tmp > 1) {
      tmp = Math.floor(tmp / 1.2);
      setPixelSize(tmp);
      await sleep(100);
    }
    console.log('done');
  }

  function onProfileClick() {
    setExpanded(!expanded);
    if (pixelSize > 1) return;
    pixelatedToSmooth();
  }

}

export default Profile