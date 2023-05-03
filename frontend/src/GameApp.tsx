import React, { createContext, useEffect, useState } from 'react'
import { GameTick } from './game/gameTick'
import { AppProvider } from '@pixi/react';
import { Application, ICanvas } from 'pixi.js';
import Game from './game/Game';
import { gameTick } from './game/GameStage';


let GameTickCtx = createContext<GameTick>(gameTick);

interface GameAppProps {
  pixiApp: Application<ICanvas>;
  gameTick: GameTick;
}

function GameApp(props: GameAppProps) {
  const [GameTickCtx, setGameTickCtx] = useState<React.Context<GameTick>>();
  const [scale, setScale] = useState<number>(1);

  const { pixiApp, gameTick } = props;
  useEffect(() => {
    setGameTickCtx(createContext<GameTick>(gameTick));
    gameTick.setSetScale = setScale;
    return () => gameTick.destructor();
  }, []);
  return (

    <AppProvider value={pixiApp}>
      {GameTickCtx ?
        <GameTickCtx.Provider value={gameTick}>
          <Game pause={false} scale={scale} />
        </GameTickCtx.Provider> :
        <></>}
    </AppProvider>
  )
}

export default GameApp