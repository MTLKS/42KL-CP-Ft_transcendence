import React, { createContext, useEffect, useState } from 'react'
import { GameData } from './game/gameData'
import { AppProvider } from '@pixi/react';
import { Application, ICanvas } from 'pixi.js';
import Game from './game/Game';

interface GameAppProps {
  pixiApp: Application<ICanvas>;
  gameTick: GameData;
}

export let GameDataCtx = createContext<GameData>(undefined as any);

function GameApp(props: GameAppProps) {
  const [scale, setScale] = useState<number>(1);

  const { pixiApp, gameTick } = props;
  useEffect(() => {
    gameTick.setSetScale = setScale;
    return () => gameTick.endGame();
  }, []);
  return (
    <AppProvider value={pixiApp}>
      <GameDataCtx.Provider value={gameTick}>
        <Game pause={false} scale={scale} />
      </GameDataCtx.Provider>
    </AppProvider>
  )
}

export default GameApp