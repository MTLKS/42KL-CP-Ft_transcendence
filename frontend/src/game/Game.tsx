import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Stage, Container, Text, Graphics } from '@pixi/react'
import Paddle from './game_objects/Paddle';
import { render } from 'react-dom';
import { BoxSize, Offset } from '../modal/GameModels';
import Pong from './game_objects/Pong';

let pongSpeed: Offset = { x: 7, y: 7 };

function Game() {
  const [boxSize, setBoxSize] = useState<BoxSize>({ w: 0, h: 0 });
  const [leftPaddlePosition, setPosition] = useState<Offset>({ y: 0, x: 0 });
  const [state, setState] = useState(1);
  const [pongPosition, setPongPosition] = useState<Offset>({ y: 0, x: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      let newPosition = { ...pongPosition };
      if (pongPosition.x > boxSize.w)
        pongSpeed.x = -pongSpeed.x;
      if (pongPosition.y > boxSize.h)
        pongSpeed.y = -pongSpeed.y;
      if (pongPosition.x < 0)
        pongSpeed.x = -pongSpeed.x;
      if (pongPosition.y < 0)
        pongSpeed.y = -pongSpeed.y;


      if (pongPosition.x > 30 && pongPosition.x < 30 + 15 && pongPosition.y < leftPaddlePosition.y + 50 && pongPosition.y > leftPaddlePosition.y - 50)
        pongSpeed.x = -pongSpeed.x;

      if (pongPosition.x > boxSize.w - 46 - 15 && pongPosition.x < boxSize.w - 46 && pongPosition.y < leftPaddlePosition.y + 50 && pongPosition.y > leftPaddlePosition.y - 50)
        pongSpeed.x = -pongSpeed.x;



      newPosition.x += pongSpeed.x;
      newPosition.y += pongSpeed.y;
      setPongPosition(newPosition);
    }, 10);
    return () => clearInterval(interval);
  }, [pongPosition])


  return (
    <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full aspect-video overflow-hidden rounded-md border-highlight border-4'
      ref={containerRef}
    >
      <Stage width={boxSize.w} height={boxSize.h} options={{ backgroundColor: 0x242424 }}
        onPointerMove={(e) => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          setPosition({ x: e.clientX - containerRect?.left!, y: e.clientY - containerRect?.top! });
        }}
      >
        <Paddle left={true} stageSize={boxSize} position={leftPaddlePosition} size={{ w: 15, h: 100 }} />
        <Paddle left={false} stageSize={boxSize} position={leftPaddlePosition} size={{ w: 15, h: 100 }} />
        <Pong stageSize={boxSize} position={pongPosition} size={{ w: 10, h: 10 }} />
      </Stage>
    </div>
  )
}

export default Game