import React, { useLayoutEffect, useRef, useState } from 'react'
import RainStream from './RainStream';

function MatrixRain() {
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const matrixRainRef = useRef<any>(null);
  const streamCount = Math.floor(width / 30);

  useLayoutEffect(() => {
    setWidth(matrixRainRef.current.offsetWidth);
    setHeight(matrixRainRef.current.offsetHeight);
  }, [])

  return (
    <div id="mr-target" ref={matrixRainRef} className='w-full h-[500px] bg-dimshadow overflow-hidden flex flex-row justify-evenly'>
      {new Array(streamCount).fill(undefined).map((_, index) => (<RainStream key={index} parentHeight={height} />))}
    </div>
  )
}

export default MatrixRain