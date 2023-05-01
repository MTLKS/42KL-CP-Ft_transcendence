import { Stage, useTick } from '@pixi/react';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { BoxSize, Offset } from '../modal/GameModels';
import Game from './Game';
import SocketApi from '../api/socketApi';
import { GameTick } from './gameTick';
import { debounce } from 'lodash';

export let gameTick: GameTick = new GameTick();

let GameTickCtx = createContext<GameTick>(gameTick);
export { GameTickCtx };

let scale: number = 1;

function GameStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = useState<BoxSize>({ w: 10, h: 10 });
  const [pause, setPause] = useState<boolean>(false);

  // useTick((delta) => {
  //   console.log(gameTick);
  // });
  useEffect(() => {
    if (!containerRef.current) return;
    const currentDiv = containerRef.current;

    const handleResize = () => {
      if (containerRef.current) {

        const newSize: BoxSize = {
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        }
        scale = newSize.w / 1600;
        setBoxSize(newSize)
      }
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(currentDiv);
    handleResize();

    return () => observer.unobserve(currentDiv);
  }, []);

  const onPointerMove = useCallback(debounce((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!containerRef.current) return;
    const { top } = containerRef.current.getBoundingClientRect();
    gameTick.updatePlayerPosition((e.clientY - top) / scale);
  }, 0.1), []);

  return (
    <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full aspect-video overflow-hidden rounded-md border-highlight border-4'
      ref={containerRef}
    >
      <GameTickCtx.Provider value={gameTick}>
        <Stage width={boxSize.w} height={boxSize.h} options={{ backgroundColor: 0x242424, sharedTicker: true }}
          onPointerMove={onPointerMove}
          onClick={() => {
            setPause(!pause)
          }}
        >
          <Game pause={pause} scale={scale} />
        </Stage>
      </GameTickCtx.Provider>
    </div>
  )
}

export default GameStage