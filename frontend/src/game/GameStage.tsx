import { Stage } from '@pixi/react';
import React, { useEffect, useRef, useState } from 'react'
import { BoxSize, Offset } from '../modal/GameModels';
import Game from './Game';

let leftPaddlePosition: Offset = { x: 0, y: 0 };
let rightPaddlePosition: Offset = { x: 0, y: 0 };

function GameStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState<BoxSize>({ w: 0, h: 0 });
  const [pause, setPause] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const currentDiv = containerRef.current;


    const handleResize = () => {
      if (containerRef.current) {

        const newSize: BoxSize = {
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
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
    <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full aspect-video overflow-hidden rounded-md border-highlight border-4'
      ref={containerRef}
    >
      <Stage width={boxSize.w} height={boxSize.h} options={{ backgroundColor: 0x242424 }}
        onPointerMove={(e) => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          leftPaddlePosition.y = e.clientY - containerRect?.top! - 50;
          rightPaddlePosition.y = e.clientY - containerRect?.top! - 50;
          leftPaddlePosition.x = 30;
          rightPaddlePosition.x = boxSize.w - 46;
        }}
        onClick={() => {
          setPause(!pause)
        }}
      >
        <Game leftPaddlePosition={leftPaddlePosition} rightPaddlePosition={rightPaddlePosition} boxSize={boxSize} pause={pause} />
      </Stage>
    </div>
  )
}

export default GameStage