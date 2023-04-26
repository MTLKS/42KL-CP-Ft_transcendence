import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Stage, Container, Text, Graphics, useTick, withFilters } from '@pixi/react'
import Paddle from './game_objects/Paddle';
import { render } from 'react-dom';
import { BoxSize, Offset } from '../modal/GameModels';
import Pong from './game_objects/Pong';
import Paticles from './game_objects/Paticles';
import RippleEffect from './game_objects/RippleEffect';
import * as PIXI from 'pixi.js';


let pongSpeed: Offset = { x: 7, y: 7 };
let pongEnterSpeed: Offset | null = null;

const Filters = withFilters(Container, {
  blur: PIXI.filters.BlurFilter,
});

function Game() {
  const [boxSize, setBoxSize] = useState<BoxSize>({ w: 0, h: 0 });
  const [leftPaddlePosition, setLeftPosition] = useState<Offset>({ y: -100, x: -100 });
  const [rightPaddlePosition, setRightPosition] = useState<Offset>({ y: -100, x: -100 });
  const [state, setState] = useState(1);
  const [pongPosition, setPongPosition] = useState<Offset>({ y: 100, x: 100 });
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
    setTimeout(() => {
      let newPosition = { ...pongPosition };
      if (pongPosition.x > boxSize.w)
        pongSpeed.x = -pongSpeed.x;
      if (pongPosition.y > boxSize.h)
        pongSpeed.y = -pongSpeed.y;
      if (pongPosition.x < 0)
        pongSpeed.x = -pongSpeed.x;
      if (pongPosition.y < 0)
        pongSpeed.y = -pongSpeed.y;


      if (pongPosition.x > leftPaddlePosition.x && pongPosition.x < leftPaddlePosition.x + 15
        && pongPosition.y < leftPaddlePosition.y + 50 && pongPosition.y > leftPaddlePosition.y - 50) {
        pongSpeed.x = -pongSpeed.x;

      }

      if (pongPosition.x > rightPaddlePosition.x - 15 && pongPosition.x < rightPaddlePosition.x
        && pongPosition.y < rightPaddlePosition.y + 50 && pongPosition.y > rightPaddlePosition.y - 50) {
        pongSpeed.x = -pongSpeed.x;
      }



      newPosition.x += pongSpeed.x;
      newPosition.y += pongSpeed.y;
      setPongPosition(newPosition);
    }, 10);
  }, [pongPosition])

  return (
    <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full aspect-video overflow-hidden rounded-md border-highlight border-4'
      ref={containerRef}
    >
      <Stage width={boxSize.w} height={boxSize.h} options={{ backgroundColor: 0x242424 }}
        onPointerMove={(e) => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          setLeftPosition({ x: 30, y: e.clientY - containerRect?.top! });
          setRightPosition({ x: boxSize.w - 46, y: e.clientY - containerRect?.top! });
        }}
      >
        <Paddle left={true} stageSize={boxSize} position={leftPaddlePosition} size={{ w: 15, h: 100 }} />
        <Paddle left={false} stageSize={boxSize} position={rightPaddlePosition} size={{ w: 15, h: 100 }} />
        <Pong stageSize={boxSize} position={pongPosition} size={{ w: 10, h: 10 }} />
        <Paticles position={pongPosition} size={{ w: 2, h: 2 }} speed={pongSpeed} />


        <RippleEffect key={'ripple'} position={{ x: 300, y: 300 }} size={{ w: 100, h: 100 }} />

      </Stage>
    </div>
  )
}

export default Game