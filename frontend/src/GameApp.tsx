import React, { createContext, useEffect, useMemo, useState } from 'react'
import { GameData } from './game/gameData'
import { AppProvider, Container } from '@pixi/react';
import { Application, ICanvas } from 'pixi.js';
import Game from './game/Game';

interface GameAppProps {
  pixiApp: Application<ICanvas>;
  gameData: GameData;
}

export let GameDataCtx = createContext<GameData>(undefined as any);

let mouseLastMoveTime: number = 0;

function GameApp(props: GameAppProps) {
  const [scale, setScale] = useState<number>(1);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [usingTicker, setUsingTicker] = useState<boolean>(true);

  const { pixiApp, gameData } = props;
  useEffect(() => {
    gameData.setSetShouldRender = setShouldRender;
    gameData.setSetScale = setScale;
    gameData.setSetUsingTicker = setUsingTicker;
    const canvas = document.getElementById('pixi') as HTMLCanvasElement
    canvas.addEventListener('mousemove', onmousemove);
    return () => {
      gameData.endGame();
      canvas.removeEventListener('mousemove', onmousemove);
    }
  }, []);
  return (
    <AppProvider value={pixiApp}>
      <GameDataCtx.Provider value={gameData}>
        <Game shouldRender={shouldRender} scale={scale} usingTicker={usingTicker} />
      </GameDataCtx.Provider>
    </AppProvider>
  )

  function onmousemove(e: MouseEvent) {
    const currentTime = Date.now();
    if (currentTime - mouseLastMoveTime < 14) return;
    mouseLastMoveTime = currentTime;
    gameData.updatePlayerPosition(e.offsetY / gameData.gameMaxHeight * 900);
  }
}

export default GameApp