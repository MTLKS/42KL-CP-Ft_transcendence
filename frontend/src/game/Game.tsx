import React, { useEffect, useRef, useState } from 'react'
import { Stage, Container, Text } from '@pixi/react'

interface BoxSize {
  w: number;
  h: number;
}

function Game() {
  const [boxSize, setBoxSize] = useState<BoxSize>({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const currentDiv = containerRef.current;
    const handleResize = () => {
      if (containerRef.current) {

        const newSize: BoxSize = {
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        }
        setBoxSize(newSize)
        console.log(newSize);
      }
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(currentDiv);
    handleResize();

    return () => observer.unobserve(currentDiv);
  }, []);

  return (
    <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full aspect-video'
      ref={containerRef}
    >
      <Stage width={boxSize.w} height={boxSize.h} options={{ backgroundColor: 0xFEF8E2 }}>
        <Container >
          <Text text="Hello World" anchor={0.5}
            x={150}
            y={150} />
        </Container>
      </Stage>
    </div>
  )
}

export default Game