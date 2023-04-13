import React, { useEffect, useRef, useState } from 'react'
import Triangle from '../../../components/Triangle';

interface ProfileEloProps {
  expanded: boolean;
  elo?: number;
  winning?: boolean;
  animate?: boolean;
}

interface BoxSize {
  w: number;
  h: number;
}

function ProfileElo(props: ProfileEloProps) {
  const { expanded, elo = 420, winning = true, animate } = props;
  const [boxSize, setBoxSize] = useState<BoxSize>({ w: 0, h: 0 });

  const containerRef=useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // console.log(width, height);
      setBoxSize({ w: width, h: height });
    }
  }, [containerRef.current?.clientHeight, containerRef.current?.clientWidth, animate]);

  return (
    <div className={expanded ? 'relative w-full h-full overflow-hidden transition-all duration-300 ease-in-out' : 'relative w-20 h-20 mx-5 transition-all duration-300 ease-in-out'}
      ref={containerRef}
    >
      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out -translate-y-1/2 ${expanded ? "text-highlight text-6xl" : " text-dimshadow text-4xl"} font-extrabold z-10`}
        style={{
          textShadow: expanded ?
            '-0.06em 0 0 #242424, 0 0.06em 0 #242424, 0.06em 0 0  #242424, 0 -0.06em 0 #242424' :
            '-0.06em 0 0 #fef8e2, 0 0.06em 0 #fef8e2, 0.06em 0 0  #fef8e2, 0 -0.06em 0 #fef8e2'
        }}
      >
        {elo}
      </div>
      <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out'>
        <Triangle color={expanded ? 'fill-highlight' : 'fill-dimshadow'} h={expanded ?boxSize.h * 0.5:boxSize.h * 0.8} w={expanded ?boxSize.w * 0.5:boxSize.w *0.8} direction={winning ? 'top' : 'bottom'} />
      </div>
    </div>
  )
}

export default ProfileElo