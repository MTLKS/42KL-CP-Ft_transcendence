import React, { createContext, useEffect, useState } from 'react'
import { GameTick } from './game/gameTick'
import { AppProvider } from '@pixi/react';
import { Application, ICanvas } from 'pixi.js';
import Game from './game/Game';

interface GameAppProps {
  pixiApp: Application<ICanvas>;
  gameTick: GameTick;
}

export let GameTickCtx = createContext<GameTick>(undefined as any);

function GameApp(props: GameAppProps) {
  const [scale, setScale] = useState<number>(1);

  const { pixiApp, gameTick } = props;
  useEffect(() => {
    gameTick.setSetScale = setScale;
    // gameTick.useLocalTick();
    return () => gameTick.destructor();
  }, []);
  return (
    <AppProvider value={pixiApp}>
      <GameTickCtx.Provider value={gameTick}>
        <Game pause={false} scale={scale} />
      </GameTickCtx.Provider>
    </AppProvider>
  )
}

export default GameApp